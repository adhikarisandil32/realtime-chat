import { useSocket } from "@/providers/socket-provider";
import React from "react";

function ClientCount() {
  const { usersCount } = useSocket();

  return (
    <>
      ({usersCount} {`${usersCount > 1 ? "Users" : "User"}`})
    </>
  );
}

export default React.memo(ClientCount);
