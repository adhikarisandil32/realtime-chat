import { envConfig } from "@/config/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface ISocketProviderContext {
  socket: Socket;
  connectedClients: number;
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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connectedClients, setConnectedClients] = useState(0);

  useEffect(() => {
    const countListener = (count: number) => setConnectedClients(count);

    socket.connect();
    socket.on("client-count", countListener);

    return () => {
      socket.disconnect();
      socket.off("client-count");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectedClients }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SocketContext.Provider>
  );
}
