const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, './public')));

// Store leaderboard data
let leaderboard = [];

// Handle socket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // When a user submits their score
  socket.on('submitScore', ({ username, score }) => {
    leaderboard.push({ username, score });
    
    // Sort leaderboard by score (descending order)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Broadcast updated leaderboard to all clients
    io.emit('leaderboardUpdate', leaderboard);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
