# 🤖 Onomex Robot Hardware Scripts & WebRTC Client

> Autonomous delivery robot onboard integration scripts, low-latency WebRTC video streaming client, and backend signaling handlers.

---

## 📋 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Hardware & Software Prerequisites](#-hardware--software-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Installation & Setup](#-installation--setup)
- [Running the WebRTC Client](#-running-the-webrtc-client)
- [Testing & Diagnostics](#-testing--diagnostics)
- [How WebRTC Signaling Works](#-how-webrtc-signaling-works)
- [File Structure](#-file-structure)

---

## 💡 Overview & Architecture

This package contains the reference implementation that runs on the autonomous food delivery robot's onboard computing unit (such as a Raspberry Pi 4/5, NVIDIA Jetson Orin Nano, or x86 SBC):

1. **Connects to NestJS Backend**: Establishes an authenticated connection to the `/webrtc` Socket.IO namespace.
2. **Camera Ingestion**: Captures video frames directly from the robot's front navigation camera via OpenCV (`cv2`) or V4L2/MediaPlayer.
3. **Peer-to-Peer Streaming**: When a supervisor opens the live feed on **`onomex_desktop`** or **`onomex_mobile`**, the robot initiates an SDP offer/answer handshake.
4. **Zero-Server Load**: Video frames stream directly **peer-to-peer** (P2P) between the robot and the viewing client via WebRTC. Video traffic never burdens the central backend server.

---

## 📦 Hardware & Software Prerequisites

- **Onboard Computer**: Linux (Ubuntu 20.04/22.04 LTS, Raspberry Pi OS, or JetPack) or Windows/macOS for simulation
- **Camera**: USB webcam, CSI ribbon camera (`/dev/video0`), or virtual loopback device
- **Python**: `3.9` to `3.12`
- Running instance of **`onomex_backend`** (typically accessible at `http://<server-ip>:3000`)

---

## ⚙️ Environment Configuration

The client requires several environment variables for authentication and network configuration:

| Variable | Required | Default | Description |
|---|---|---|---|
| `ROBOT_ID` | **Yes** | — | Unique database ID of the robot |
| `SECRET_KEY` | **Yes** | — | Authentication secret key registered in the database |
| `BACKEND_URL` | No | `http://localhost:3000` | NestJS backend URL hosting the `/webrtc` namespace |
| `STUN_URL` | No | `stun:stun.l.google.com:19302` | STUN server for NAT discovery |
| `CAMERA_INDEX` | No | `0` | Device index for OpenCV (`0` for `/dev/video0`) |

---

## 🚀 Installation & Setup

1. **Create and Activate a Virtual Environment**:
   ```bash
   # Navigate into robot_scripts directory
   cd robot_scripts

   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On Linux/macOS:
   source venv/bin/activate
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   ```

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🎥 Running the WebRTC Client

### Option 1: Inline Environment Variables (Linux / macOS)
```bash
ROBOT_ID="67b8d9c2e4b0a1d2f3a4b5c9" \
SECRET_KEY="robot-secret-token" \
BACKEND_URL="http://192.168.1.100:3000" \
CAMERA_INDEX=0 \
python robot-webrtc-client.py
```

### Option 2: Windows PowerShell
```powershell
$env:ROBOT_ID="67b8d9c2e4b0a1d2f3a4b5c9"
$env:SECRET_KEY="robot-secret-token"
$env:BACKEND_URL="http://localhost:3000"
$env:CAMERA_INDEX="0"
python robot-webrtc-client.py
```

### Expected Output:
```text
[INFO] Connecting to backend at http://localhost:3000/webrtc...
[INFO] Connected to /webrtc namespace!
[INFO] Registering as robot 67b8d9c2e4b0a1d2f3a4b5c9...
[INFO] Robot registered successfully! Waiting for viewers...
```

When a user in the desktop POS opens the robot's live stream:
```text
[INFO] Viewer joined: socket_abc123. Creating WebRTC offer...
[INFO] Sent WebRTC offer to viewer socket_abc123
[INFO] Received answer from viewer socket_abc123
[INFO] ICE Connection state: connected
[INFO] P2P WebRTC video stream active!
```

---

## 🧪 Testing & Diagnostics

Run automated unit and mock tests with `pytest`:

```bash
# Run test suite
pytest

# Run tests with detailed output
pytest -v test_webrtc_client.py
```

---

## 🔄 How WebRTC Signaling Works

```
┌──────────────┐             ┌────────────────┐             ┌──────────────┐
│ Robot Script │             │ onomex_backend │             │ Desktop POS  │
│  (Hardware)  │             │  (Signaling)   │             │   (Viewer)   │
└──────┬───────┘             └───────┬────────┘             └──────┬───────┘
       │                             │                             │
       │─── 1. register-robot ──────>│                             │
       │    (ROBOT_ID + SECRET_KEY)  │                             │
       │                             │<─── 2. viewer-join ─────────│
       │<── 3. viewer-joined ────────│    (requests robot camera)  │
       │                             │                             │
       │─── 4. offer (SDP) ─────────>│                             │
       │                             │─── 5. offer (SDP) ─────────>│
       │                             │<── 6. answer (SDP) ─────────│
       │<── 7. answer (SDP) ─────────│                             │
       │                             │                             │
       │<=========== 8. Encrypted P2P Media Stream (SRTP) ========>│
       │                 (Direct video connection)                 │
```

---

## 📁 File Structure

```
robot_scripts/
├── robot-webrtc-client.py    # Main async WebRTC signaling & video capture client
├── test_webrtc_client.py     # Pytest test suite for signaling protocol validation
├── requirements.txt          # Python dependencies (aiortc, python-socketio, opencv)
└── README.md                 # Documentation and setup instructions
```
