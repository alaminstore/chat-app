const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`server is running on port ${PORT}`)
);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
const totalClientsCount = new Set();
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  totalClientsCount.add(socket.id);
  io.emit("clients-total", totalClientsCount.size);

  socket.on("disconnect", () => {
    totalClientsCount.delete(socket.id);
    io.emit("clients-total", totalClientsCount.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });
}
