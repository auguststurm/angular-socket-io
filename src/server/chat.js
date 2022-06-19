const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const port = process.env.SOCKET_SERVER_PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = socketio(server, {
	cors: {
		origin: 'http://localhost:4200'
	}
});

io.on('connection', socket => {

  socket.on('join', function(data) {
    socket.join(data.room);
    socket.emit('new user joined', {user: data.user, message:'has joined room.'});
    socket.in('chat').emit('new user joined', {user: data.user, message:'has joined room.'});

  });

  socket.on('leave', function(data) {
    socket.emit('left room', {user: data.user, message:'has left room.'});
    socket.in('chat').emit('left room', {user: data.user, message:'has left room.'});
    socket.leave(data.room);
  });

  socket.on('message',function(data) {
    socket.in(data.room).emit('new message', {user:data.user, message:data.message});
  });

});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
