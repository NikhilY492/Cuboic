import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch

# Mock aiortc and socketio so we don't need native libraries installed for unit tests
import sys
import os

os.environ['ROBOT_ID'] = 'test-id'
os.environ['SECRET_KEY'] = 'test-secret'

sys.modules['aiortc'] = MagicMock()
sys.modules['aiortc.contrib.media'] = MagicMock()
sys.modules['socketio'] = MagicMock()

# Now we can import the script safely
import importlib
webrtc_client = importlib.import_module('robot-webrtc-client')

@pytest.fixture
def mock_sio():
    sio = MagicMock()
    sio.emit = AsyncMock()
    sio.disconnect = AsyncMock()
    return sio

@pytest.mark.asyncio
async def test_connect_emits_join_robot(mock_sio):
    # Patch the global sio object in the module
    webrtc_client.sio = mock_sio
    webrtc_client.ROBOT_ID = 'test-robot'
    webrtc_client.SECRET_KEY = 'test-secret'
    
    await webrtc_client.connect()
    
    mock_sio.emit.assert_awaited_once_with("webrtc:join_robot", {
        "robotId": 'test-robot',
        "secretKey": 'test-secret',
    }, namespace="/webrtc")

@pytest.mark.asyncio
async def test_auth_failed_disconnects(mock_sio):
    webrtc_client.sio = mock_sio
    
    await webrtc_client.on_auth_failed({"reason": "Invalid credentials"})
    
    mock_sio.disconnect.assert_awaited_once()

@pytest.mark.asyncio
@patch('robot-webrtc-client.create_peer_connection')
async def test_viewer_ready_creates_offer(mock_create_pc, mock_sio):
    webrtc_client.sio = mock_sio
    webrtc_client.ROBOT_ID = 'test-robot'
    
    mock_pc = MagicMock()
    mock_pc.createOffer = AsyncMock(return_value="mock_offer")
    mock_pc.setLocalDescription = AsyncMock()
    mock_pc.localDescription.sdp = "mock_sdp_string"
    
    mock_create_pc.return_value = mock_pc
    
    await webrtc_client.on_viewer_ready({"viewerSocketId": "viewer-123"})
    
    mock_create_pc.assert_awaited_once_with("viewer-123")
    mock_pc.createOffer.assert_awaited_once()
    mock_pc.setLocalDescription.assert_awaited_once_with("mock_offer")
    mock_sio.emit.assert_awaited_once_with("webrtc:offer", {
        "robotId": 'test-robot',
        "sdp": "mock_sdp_string",
        "targetSocketId": "viewer-123",
    }, namespace="/webrtc")

@pytest.mark.asyncio
async def test_cleanup_peer():
    mock_pc = MagicMock()
    mock_pc.close = AsyncMock()
    
    webrtc_client.peer_connections = {"viewer-123": mock_pc}
    
    await webrtc_client.cleanup_peer("viewer-123")
    
    mock_pc.close.assert_awaited_once()
    assert "viewer-123" not in webrtc_client.peer_connections
