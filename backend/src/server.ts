import { app } from "./app.js";
import http from "http";
import { config } from "./config/config.js";
import { Server } from "socket.io";
import { db } from "./db";

const server = http.createServer(app);

const PORT = +config.PORT;
const io = new Server(server, {
  cors: {
    origin: config.ALLOWED_CORS_ORIGINS ?? false,
  },
});

const updateUserCount = () => {
  const count = io.engine.clientsCount;
  io.emit("client-count", count);
};

io.on("connection", (socket) => {
  console.log(`[connected] SocketID: ${socket.id}`);
  updateUserCount();

  // socket.on("message", (message) => {
  //   socket.emit("message", message);
  // });
  socket.on("message", async (data: { message: string; sender: string }) => {
    const createdAt = new Date().getTime();

    io.emit("message", { ...data, createdAt });
    await db.update(({ chats }) =>
      chats.push({
        message: data.message,
        sender: data.sender,
        createdAt,
      }),
    );
  });

  socket.on("connect", updateUserCount);
  socket.on("disconnect", (reason) => {
    console.log(`[disconnected] ${reason}`);
    updateUserCount();
  });

  // let activelyTypingUsers: string[] = [];
  socket.on("typing-on", (data: { user: string }) => {
    // activelyTypingUsers.push(data.user);
    socket.broadcast.emit("typing-on", data.user);
  });

  socket.on("typing-off", (data: { user: string }) => {
    // activelyTypingUsers = activelyTypingUsers.filter(
    //   (user) => user !== data.user,
    // );
    socket.broadcast.emit("typing-off", data.user);
  });
});

server.listen(PORT, () => {
  console.log(`[server] server listening on port ${PORT}`);
});
