const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.SOCKET_SERVER_PORT || 3000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let users = {};

io.on("connection", (socket) => {
  socket.on("join", ({ user, room }) => {
    socket.join(room);

    if (!users[room]) {
      users[room] = [];
    }

    users[room].push(user);

    io.to(room).emit("new user joined", {
      user,
      message: "has joined room.",
      users: users[room],
    });
  });

  socket.on("leave", ({ user, room }) => {
    if (users[room]) {
      users[room] = users[room].filter((u) => u !== user);
    }

    io.to(room).emit("left room", {
      user,
      message: "has left room.",
      users: users[room],
    });

    socket.leave(room);
  });

  socket.on("message", ({ user, room, message }) => {
    io.to(room).emit("new message", { user, message });
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
