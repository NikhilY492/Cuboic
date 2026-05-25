#!/usr/bin/env python3
"""
Thambi Robot — WebRTC Signaling Client (Reference Implementation)
==================================================================
This script runs on the robot hardware. It:
  1. Connects to the thambi_backend /webrtc Socket.IO namespace
  2. Authenticates with its robotId + secretKey
  3. Opens the camera via aiortc
  4. Waits for a viewer to join, then initiates the SDP offer/answer handshake
  5. Streams video peer-to-peer (media data never touches the server)

Dependencies:
    pip install python-socketio[asyncio] aiortc aiohttp opencv-python

Usage:
    ROBOT_ID=<your-robot-id> SECRET_KEY=<your-secret> python robot-webrtc-client.py

Environment variables:
    ROBOT_ID      — robot's ID from the database
    SECRET_KEY    — robot's secret key (stored in DB, used for auth)
    BACKEND_URL   — signaling server URL (default: http://localhost:3000)
    STUN_URL      — STUN server URL (default: stun:stun.l.google.com:19302)
    CAMERA_INDEX  — OpenCV camera device index (default: 0)
"""

import asyncio
import json
import logging
import os

import socketio
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCIceCandidate
from aiortc.contrib.media import MediaPlayer

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
log = logging.getLogger("robot-webrtc")

# ── Config (override via env vars) ───────────────────────────────────────────
ROBOT_ID = os.environ.get("ROBOT_ID", "")
SECRET_KEY = os.environ.get("SECRET_KEY", "")
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:3000")
STUN_URL = os.environ.get("STUN_URL", "stun:stun.l.google.com:19302")
CAMERA_INDEX = int(os.environ.get("CAMERA_INDEX", "0"))

if not ROBOT_ID or not SECRET_KEY:
    raise SystemExit("ERROR: ROBOT_ID and SECRET_KEY environment variables are required.")

# ── Socket.IO client ──────────────────────────────────────────────────────────
sio = socketio.AsyncClient(logger=False)

# Active peer connections keyed by viewer socket ID
peer_connections: dict[str, RTCPeerConnection] = {}

# Camera source (shared across all peer connections)
player: MediaPlayer | None = None


def get_player() -> MediaPlayer:
    """Return a shared MediaPlayer for the camera."""
    global player
    if player is None:
        # On Linux use v4l2: MediaPlayer(f"/dev/video{CAMERA_INDEX}", format="v4l2")
        # On macOS use avfoundation: MediaPlayer("default:none", format="avfoundation")
        # For testing with a video file: MediaPlayer("test.mp4")
        player = MediaPlayer(f"/dev/video{CAMERA_INDEX}", format="v4l2",
                             options={"framerate": "30", "video_size": "1280x720"})
    return player


async def create_peer_connection(viewer_socket_id: str) -> RTCPeerConnection:
    """Create and register a new RTCPeerConnection for a viewer."""
    pc = RTCPeerConnection(
        configuration={"iceServers": [{"urls": [STUN_URL]}]}
    )
    peer_connections[viewer_socket_id] = pc

    # Add camera video track
    source = get_player()
    if source.video:
        pc.addTrack(source.video)
    if source.audio:
        pc.addTrack(source.audio)

    @pc.on("icecandidate")
    async def on_ice_candidate(candidate):
        if candidate:
            await sio.emit("webrtc:ice", {
                "robotId": ROBOT_ID,
                "candidate": {
                    "candidate": candidate.to_sdp(),
                    "sdpMid": candidate.sdpMid,
                    "sdpMLineIndex": candidate.sdpMLineIndex,
                },
            })
            log.debug(f"Sent ICE candidate to server for viewer {viewer_socket_id}")

    @pc.on("connectionstatechange")
    async def on_state_change():
        log.info(f"[{viewer_socket_id}] Connection state: {pc.connectionState}")
        if pc.connectionState in ("failed", "closed", "disconnected"):
            await cleanup_peer(viewer_socket_id)

    return pc


async def cleanup_peer(viewer_socket_id: str):
    pc = peer_connections.pop(viewer_socket_id, None)
    if pc:
        await pc.close()
        log.info(f"Closed peer connection for viewer {viewer_socket_id}")


# ── Socket.IO event handlers ──────────────────────────────────────────────────

@sio.event(namespace="/webrtc")
async def connect():
    log.info("Connected to signaling server — authenticating as robot...")
    await sio.emit("webrtc:join_robot", {
        "robotId": ROBOT_ID,
        "secretKey": SECRET_KEY,
    }, namespace="/webrtc")


@sio.event(namespace="/webrtc")
async def disconnect():
    log.warning("Disconnected from signaling server")
    for sid in list(peer_connections.keys()):
        await cleanup_peer(sid)


@sio.on("webrtc:joined", namespace="/webrtc")
async def on_joined(data):
    log.info(f"Auth successful — joined room {data['robotId']} as {data['role']}")


@sio.on("webrtc:auth_failed", namespace="/webrtc")
async def on_auth_failed(data):
    log.error(f"Auth failed: {data.get('reason')}")
    await sio.disconnect()


@sio.on("webrtc:viewer_ready", namespace="/webrtc")
async def on_viewer_ready(data):
    """A viewer has joined our room — initiate the offer."""
    viewer_socket_id = data["viewerSocketId"]
    log.info(f"Viewer ready: {viewer_socket_id} — creating offer...")

    pc = await create_peer_connection(viewer_socket_id)

    offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    await sio.emit("webrtc:offer", {
        "robotId": ROBOT_ID,
        "sdp": pc.localDescription.sdp,
        "targetSocketId": viewer_socket_id,
    }, namespace="/webrtc")
    log.info(f"Offer sent to viewer {viewer_socket_id}")


@sio.on("webrtc:answer", namespace="/webrtc")
async def on_answer(data):
    """Browser answered our offer — set the remote description."""
    from_socket = data.get("fromSocketId", "")
    sdp = data["sdp"]

    pc = peer_connections.get(from_socket)
    if not pc:
        log.warning(f"No peer connection found for fromSocketId={from_socket}")
        return

    await pc.setRemoteDescription(RTCSessionDescription(sdp=sdp, type="answer"))
    log.info(f"Remote description set for viewer {from_socket}")


@sio.on("webrtc:ice", namespace="/webrtc")
async def on_ice(data):
    """ICE candidate from browser — forward to the correct peer connection."""
    candidate_data = data["candidate"]
    from_socket = data.get("fromSocketId", "")

    pc = peer_connections.get(from_socket)
    if not pc:
        # If we only have one viewer, apply to whichever connection exists
        if len(peer_connections) == 1:
            pc = next(iter(peer_connections.values()))
        else:
            log.warning("ICE candidate received but no matching peer connection")
            return

    try:
        candidate = RTCIceCandidate(
            sdpMid=candidate_data.get("sdpMid"),
            sdpMLineIndex=candidate_data.get("sdpMLineIndex"),
            candidate=candidate_data.get("candidate", ""),
        )
        await pc.addIceCandidate(candidate)
        log.debug("ICE candidate applied")
    except Exception as e:
        log.error(f"Failed to add ICE candidate: {e}")


@sio.on("webrtc:peer_left", namespace="/webrtc")
async def on_peer_left(data):
    viewer_socket_id = data.get("socketId", "")
    log.info(f"Viewer {viewer_socket_id} left — cleaning up peer connection")
    await cleanup_peer(viewer_socket_id)


# ── Entry point ───────────────────────────────────────────────────────────────

async def main():
    log.info(f"Connecting to {BACKEND_URL} as robot {ROBOT_ID}...")
    await sio.connect(
        BACKEND_URL,
        namespaces=["/webrtc"],
        transports=["websocket"],
    )
    await sio.wait()


if __name__ == "__main__":
    asyncio.run(main())
