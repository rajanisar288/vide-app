let localStream;
let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');
let peer;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;
  })
  .catch(error => console.error('Error accessing media devices:', error));

// Set up WebRTC connection
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('signal', data => {
  peer.signal(data);
});

peer = new SimplePeer({ initiator: location.hash === '#1', stream: localStream });

peer.on('signal', data => {
  socket.emit('signal', data);
});

peer.on('stream', stream => {
  remoteVideo.srcObject = stream;
});

peer.on('close', () => {
  console.log('Peer connection closed');
});

peer.on('error', err => {
  console.error('Peer connection error:', err);
});
