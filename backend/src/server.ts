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

const updateUserCount = async () => {
  const users = await io.fetchSockets();
  console.log({ count: users.length });
  io.emit("client-count", users.length);
};

io.on("connection", (socket) => {
  console.log(`[connected] SocketID: ${socket.id}`);
  updateUserCount();

  socket.on(
    "message",
    async (data: { message: string; sender: string; identifier: string }) => {
      const createdAt = new Date().getTime();
      const id = crypto.randomUUID();

      io.emit("message", { ...data, id, createdAt, status: "sent" });
      await db.update(({ chats }) =>
        chats.push({
          id,
          message: data.message,
          sender: data.sender,
          status: "sent",
          createdAt,
        }),
      );
    },
  );

  socket.on("connect", updateUserCount);
  socket.on("disconnect", (reason) => {
    console.log(`[disconnected] ${reason}`);
    socket.disconnect(true);
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
