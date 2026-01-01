import React, { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
// import { socket } from "@/services/socket/socket";
import { envConfig } from "@/config/config";
import { IClientChat } from "@/types/chat-response";

interface ISocketProviderContext {
  socket: Socket;
  connectedClients: number;
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
  const [connectedClients, setConnectedClients] = useState(0);
  const [messages, setMessages] = useState<IClientChat[]>([]);

  const emitMessage = (data: IClientChat) => {
    socket.emit("message", data);
  };

  useEffect(() => {
    const countListener = (count: number) => setConnectedClients(count);
    const messageHandler = (messageData: IClientChat) =>
      setMessages((prev) => {
        const strictlyPreviousMessages = prev.filter(
          (prevMessage) => prevMessage.identifier !== messageData.identifier
        );

        return [...strictlyPreviousMessages, messageData];
      });

    socket.connect();
    socket.on("client-count", countListener);
    socket.on("message", messageHandler);

    return () => {
      socket.disconnect();
      socket.off("client-count", countListener);
      socket.off("message", messageHandler);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, connectedClients, emitMessage, messages, setMessages }}
    >
      {children}
    </SocketContext.Provider>
  );
}
