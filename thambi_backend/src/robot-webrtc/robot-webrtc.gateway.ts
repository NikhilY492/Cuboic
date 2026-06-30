import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RobotsService } from '../robots/robots.service';
import { RobotRuntimeService } from '../robot-runtime/robot-runtime.service';
import { JwtService } from '@nestjs/jwt';

/**
 * Tracks who is connected on the /webrtc namespace.
 * role: 'robot' — the physical robot (authenticated via secretKey)
 * role: 'viewer' — a browser/desktop client watching the stream
 */
interface WebRtcPeer {
  socketId: string;
  robotId: string;
  role: 'robot' | 'viewer';
}

/**
 * WebRTC Signaling Gateway
 *
 * Namespace: /webrtc   (separate from the default namespace used by robot-runtime)
 *
 * Signal flow (no media data touches this server):
 *
 *   Robot                     Server                    Browser
 *   ─────────────────────────────────────────────────────────────
 *   webrtc:join  ──────────►  validates, joins room
 *                             (viewer joins room too)
 *   webrtc:offer ──────────►  relay ──────────────────► webrtc:offer
 *                             relay ◄────────────────── webrtc:answer
 *   webrtc:answer◄─────────── relay
 *   webrtc:ice   ──────────►  relay ──────────────────► webrtc:ice
 *                             relay ◄────────────────── webrtc:ice
 *   webrtc:ice   ◄─────────── relay
 */
@WebSocketGateway({
  namespace: '/webrtc',
  cors: { origin: '*' },
})
export class RobotWebRtcGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /** In-memory map: socketId → peer info */
  private peers = new Map<string, WebRtcPeer>();

  constructor(
    private readonly robotsService: RobotsService,
    private readonly runtimeService: RobotRuntimeService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  handleConnection(client: Socket) {
    console.log(`[WebRTC] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const peer = this.peers.get(client.id);
    if (peer) {
      console.log(
        `[WebRTC] ${peer.role} disconnected from room ${peer.robotId}: ${client.id}`,
      );
      // Notify the rest of the room so the other side can reset its peer connection
      client.to(peer.robotId).emit('webrtc:peer_left', {
        role: peer.role,
        socketId: client.id,
      });
      this.peers.delete(client.id);
    }
  }

  // ─── Robot join ───────────────────────────────────────────────────────────

  /**
   * Robot authenticates and joins its own room.
   *
   * Payload: { robotId: string, secretKey: string }
   * Emits back: 'webrtc:joined' | 'webrtc:auth_failed'
   */
  @SubscribeMessage('webrtc:join_robot')
  async handleRobotJoin(
    @MessageBody() data: { robotId: string; secretKey: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { robotId, secretKey } = data;

    if (!robotId || !secretKey) {
      client.emit('webrtc:auth_failed', { reason: 'Missing credentials' });
      client.disconnect();
      return;
    }

    const robot = await this.robotsService.findByIdWithSecret(robotId);
    if (!robot || robot.secretKey !== secretKey) {
      client.emit('webrtc:auth_failed', { reason: 'Invalid credentials' });
      client.disconnect();
      return;
    }

    client.join(robotId);
    this.peers.set(client.id, { socketId: client.id, robotId, role: 'robot' });

    console.log(`[WebRTC] Robot ${robotId} joined signaling room`);
    client.emit('webrtc:joined', { robotId, role: 'robot' });

    // Notify any viewers already waiting in the room
    client.to(robotId).emit('webrtc:robot_ready', { robotId });
  }

  // ─── Viewer join ──────────────────────────────────────────────────────────

  /**
   * Browser / desktop viewer joins a robot's room to receive the stream.
   *
   * Payload: { robotId: string, token: string }  (token = user's JWT)
   * Emits back: 'webrtc:joined' | 'webrtc:auth_failed'
   */
  @SubscribeMessage('webrtc:join_viewer')
  async handleViewerJoin(
    @MessageBody() data: { robotId: string; token: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { robotId, token } = data;

    if (!robotId || !token) {
      client.emit('webrtc:auth_failed', { reason: 'Missing credentials' });
      client.disconnect();
      return;
    }

    // Validate JWT and check the user belongs to the robot's restaurant
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      client.emit('webrtc:auth_failed', { reason: 'Invalid token' });
      client.disconnect();
      return;
    }

    const robot = await this.robotsService.findByIdWithSecret(robotId);
    if (!robot || robot.restaurantId !== payload.restaurantId) {
      client.emit('webrtc:auth_failed', { reason: 'Access denied' });
      client.disconnect();
      return;
    }

    client.join(robotId);
    this.peers.set(client.id, { socketId: client.id, robotId, role: 'viewer' });

    console.log(
      `[WebRTC] Viewer ${client.id} (user ${payload.sub}) joined room ${robotId}`,
    );
    client.emit('webrtc:joined', { robotId, role: 'viewer' });

    // Tell the robot a viewer is ready so it can initiate the offer
    client
      .to(robotId)
      .emit('webrtc:viewer_ready', { viewerSocketId: client.id });
  }

  // ─── SDP Offer (Robot → Browser) ─────────────────────────────────────────

  /**
   * Payload: { robotId: string, sdp: string, targetSocketId?: string }
   *
   * If targetSocketId is provided, relay only to that viewer (unicast).
   * Otherwise broadcast to all viewers in the room (multicast).
   */
  @SubscribeMessage('webrtc:offer')
  handleOffer(
    @MessageBody()
    data: { robotId: string; sdp: string; targetSocketId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const peer = this.peers.get(client.id);
    if (!peer || peer.role !== 'robot') {
      console.warn(`[WebRTC] webrtc:offer from non-robot socket ${client.id}`);
      return;
    }

    console.log(`[WebRTC] Relaying offer from robot ${peer.robotId}`);

    const payload = {
      robotId: peer.robotId,
      sdp: data.sdp,
      fromSocketId: client.id,
    };

    if (data.targetSocketId) {
      this.server.to(data.targetSocketId).emit('webrtc:offer', payload);
    } else {
      client.to(peer.robotId).emit('webrtc:offer', payload);
    }
  }

  // ─── SDP Answer (Browser → Robot) ────────────────────────────────────────

  /**
   * Payload: { robotId: string, sdp: string }
   */
  @SubscribeMessage('webrtc:answer')
  handleAnswer(
    @MessageBody() data: { robotId: string; sdp: string },
    @ConnectedSocket() client: Socket,
  ) {
    const peer = this.peers.get(client.id);
    if (!peer || peer.role !== 'viewer') {
      console.warn(
        `[WebRTC] webrtc:answer from non-viewer socket ${client.id}`,
      );
      return;
    }

    console.log(`[WebRTC] Relaying answer to robot ${data.robotId}`);
    client.to(data.robotId).emit('webrtc:answer', {
      robotId: data.robotId,
      sdp: data.sdp,
      fromSocketId: client.id,
    });
  }

  // ─── ICE Candidates (bidirectional) ──────────────────────────────────────

  /**
   * Payload: { robotId: string, candidate: RTCIceCandidateInit }
   *
   * Works from both robot and viewer direction.
   * Relays to every other socket in the room.
   */
  @SubscribeMessage('webrtc:ice')
  handleIce(
    @MessageBody() data: { robotId: string; candidate: any },
    @ConnectedSocket() client: Socket,
  ) {
    const peer = this.peers.get(client.id);
    if (!peer) return;

    client.to(peer.robotId).emit('webrtc:ice', {
      candidate: data.candidate,
      fromRole: peer.role,
      fromSocketId: client.id,
    });
  }

  // ─── Explicit leave ───────────────────────────────────────────────────────

  /**
   * Payload: { robotId: string }
   */
  @SubscribeMessage('webrtc:leave')
  handleLeave(
    @MessageBody() data: { robotId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const peer = this.peers.get(client.id);
    if (!peer) return;

    client.to(peer.robotId).emit('webrtc:peer_left', {
      role: peer.role,
      socketId: client.id,
    });

    client.leave(peer.robotId);
    this.peers.delete(client.id);
    console.log(`[WebRTC] ${peer.role} ${client.id} left room ${peer.robotId}`);
  }
}
