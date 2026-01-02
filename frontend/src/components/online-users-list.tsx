import { useSocket } from "@/providers/socket-provider";
import React from "react";

function OnlineUserList() {
  const { onlineUsers } = useSocket();

  return (
    <div className="space-y-2 p-2">
      {onlineUsers.map((user) => (
        <div
          key={user}
          className="flex items-center gap-2"
        >
          <span className="block size-2.5 rounded-full bg-green-800" />
          <span>{user}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(OnlineUserList);
