import React, { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
// import { socket } from "@/services/socket/socket";
import { envConfig } from "@/config/config";
import { IClientChat } from "@/types/chat-response";
import { useProtected } from "./protected";

interface ISocketSettersProviderContext {
  emitMessage: (data: IClientChat) => void;
  setMessages: React.Dispatch<React.SetStateAction<IClientChat[]>>;
}

interface ISocketGettersProviderContext {
  socket: Socket;
  usersCount: number;
  onlineUsers: string[];
  messages: IClientChat[];
  scrollToLatest: React.RefObject<boolean>;
  emptyMessageElement: React.RefObject<HTMLDivElement | null>;
  chatsScrollContainerElem: React.RefObject<HTMLDivElement | null>;
  chatsScrollElemPrevMeasurements: React.RefObject<Record<
    string,
    number
  > | null>;
}

const SocketSettersContext = React.createContext<
  ISocketSettersProviderContext | undefined
>(undefined);

const SocketGettersContext = React.createContext<
  ISocketGettersProviderContext | undefined
>(undefined);

export const useSocketSetters = () => {
  const context = React.useContext(SocketSettersContext);
  if (!context) {
    throw new Error("user context within the provider");
  }

  return context;
};

export const useSocketGetters = () => {
  const context = React.useContext(SocketGettersContext);
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
  const scrollToLatest = useRef(false);
  const emptyMessageElement = useRef<HTMLDivElement | null>(null);
  const chatsScrollContainerElem = useRef<HTMLDivElement | null>(null);
  const chatsScrollElemPrevMeasurements = useRef<Record<string, number> | null>(
    null
  );

  const { username } = useProtected();
  const [usersCount, setUsersCount] = useState(0);
  const [messages, setMessages] = useState<IClientChat[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const emitMessage = (data: IClientChat) => {
    socket.emit("message", data);
  };

  useEffect(() => {
    const countListener = (count: number) => setUsersCount(count);
    const messageHandler = (messageData: IClientChat) => {
      if (chatsScrollContainerElem.current) {
        const clientHeight = chatsScrollContainerElem.current.clientHeight;
        const scrollTop = chatsScrollContainerElem.current.scrollTop;
        const scrollHeight = chatsScrollContainerElem.current.scrollHeight;

        // 25 clearence
        if (clientHeight + scrollTop >= scrollHeight - 25) {
          scrollToLatest.current = true;
        } else {
          scrollToLatest.current = false;
        }
      } else {
        scrollToLatest.current = true;
      }
      setMessages((prev) => {
        const strictlyPreviousMessages = prev.filter(
          (prevMessage) => prevMessage.identifier !== messageData.identifier
        );

        return [...strictlyPreviousMessages, messageData];
      });
    };

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

  const setterValues: ISocketSettersProviderContext = useMemo(
    () => ({ emitMessage, setMessages }),
    []
  );

  const getterValues: ISocketGettersProviderContext = {
    socket,
    usersCount,
    onlineUsers,
    messages,
    scrollToLatest,
    emptyMessageElement,
    chatsScrollContainerElem,
    chatsScrollElemPrevMeasurements,
  };

  return (
    <SocketSettersContext.Provider value={setterValues}>
      <SocketGettersContext.Provider value={getterValues}>
        {children}
      </SocketGettersContext.Provider>
    </SocketSettersContext.Provider>
  );
}
