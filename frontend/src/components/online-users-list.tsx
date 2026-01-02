import { useSocket } from "@/providers/socket-provider";
import React from "react";

function OnlineUserList() {
  const { onlineUsers } = useSocket();

  return (
    <div className="space-y-2 p-2">
      {onlineUsers.map((user) => (
        <div
          key={user}
          title={user}
          className="flex items-center gap-2"
        >
          <span className="block shrink-0 size-2.5 rounded-full bg-green-800" />
          <span className="truncate">{user}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(OnlineUserList);
