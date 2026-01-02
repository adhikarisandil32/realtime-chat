import React, { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
// import { socket } from "@/services/socket/socket";
import { envConfig } from "@/config/config";
import { IClientChat } from "@/types/chat-response";
import { useProtected } from "./protected";

interface ISocketProviderContext {
  socket: Socket;
  usersCount: number;
  onlineUsers: string[];
  emitMessage: (data: IClientChat) => void;
  messages: IClientChat[];
  setMessages: React.Dispatch<React.SetStateAction<IClientChat[]>>;
}

const SocketContext = React.createContext<ISocketProviderContext | undefined>(
  undefined
);

export const useSocket = () => {
  const context = React.useContext(SocketContext);

  if (!context) {
    throw new Error("user context within the provider");
  }

  return context;
};

const socket = io(envConfig.apiUrl, { autoConnect: false });
export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username } = useProtected();
  const [usersCount, setUsersCount] = useState(0);
  const [messages, setMessages] = useState<IClientChat[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const emitMessage = (data: IClientChat) => {
    socket.emit("message", data);
  };

  useEffect(() => {
    const countListener = (count: number) => setUsersCount(count);
    const messageHandler = (messageData: IClientChat) =>
      setMessages((prev) => {
        const strictlyPreviousMessages = prev.filter(
          (prevMessage) => prevMessage.identifier !== messageData.identifier
        );

        return [...strictlyPreviousMessages, messageData];
      });

    socket.connect();
    if (username) {
      socket.emit("connected-user", { user: username });
    }
    socket.on("client-count", countListener);
    socket.on("message", messageHandler);
    socket.on("active-clients", (clients: string[]) => setOnlineUsers(clients));

    return () => {
      socket.disconnect();
      socket.off("client-count", countListener);
      socket.off("message", messageHandler);
      socket.off("active-clients");
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        usersCount,
        onlineUsers,
        emitMessage,
        messages,
        setMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
