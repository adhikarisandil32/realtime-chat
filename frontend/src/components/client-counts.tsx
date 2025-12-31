import React from "react";

function ClientCount({
  connectedClientsCount,
  className,
}: {
  connectedClientsCount: number;
  className?: string;
}) {
  return (
    <h2 className={className}>
      Conversation Box ({connectedClientsCount}{" "}
      {`${connectedClientsCount > 1 ? "Users" : "User"}`})
    </h2>
  );
}

export default React.memo(ClientCount);
