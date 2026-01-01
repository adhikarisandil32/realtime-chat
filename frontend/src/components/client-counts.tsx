import { useSocket } from "@/providers/socket-provider";
import React from "react";

function ClientCount({ className }: { className?: string }) {
  const { connectedClients: connectedClientsCount } = useSocket();

  return (
    <h2 className={className}>
      Conversation Box ({connectedClientsCount}{" "}
      {`${connectedClientsCount > 1 ? "Users" : "User"}`})
    </h2>
  );
}

export default React.memo(ClientCount);
