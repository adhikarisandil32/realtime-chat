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

const activeUsers = new Map();
const activelyTypingUsers = new Set();

const updateUserCount = async () => {
  // const users = await io.fetchSockets();
  const usersCount = activeUsers.size;
  console.log({ count: usersCount });
  io.emit("client-count", usersCount);
  io.emit("active-clients", Array.from(activeUsers.values()));
};

io.on("connection", (socket) => {
  console.log(`[connected] SocketID: ${socket.id}`);

  socket.on("connected-user", async (data: { user: string }) => {
    await db.update(({ users }) =>
      users.includes(data.user) ? null : users.push(data.user),
    );

    if (Array.from(activeUsers.values()).includes(data.user)) {
      updateUserCount();
      return;
    }

    activeUsers.set(socket.id, data.user);
    updateUserCount();
  });

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

  socket.on("disconnect", (reason) => {
    console.log(`[disconnected] ${reason}`);
    socket.disconnect(true);
    activeUsers.delete(socket.id);
    updateUserCount();
  });

  socket.on("typing-on", (data: { user: string }) => {
    if (activelyTypingUsers.has(data.user)) return;
    activelyTypingUsers.add(data.user);
    socket.broadcast.emit("typing-on", Array.from(activelyTypingUsers));
  });

  socket.on("typing-off", (data: { user: string }) => {
    activelyTypingUsers.delete(data.user);
    socket.broadcast.emit("typing-off", Array.from(activelyTypingUsers));
  });
});

server.listen(PORT, () => {
  console.log(`[server] server listening on port ${PORT}`);
});
