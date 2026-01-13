import { cn } from "@/lib/utils";
import { useProtected } from "@/providers/protected";
import { useSocketGetters } from "@/providers/socket-provider";
import React from "react";

function OnlineUserList() {
  const { onlineUsers } = useSocketGetters();
  const { username } = useProtected();

  return (
    <div className="space-y-1 p-2">
      {onlineUsers.map((user) => (
        <div
          key={user}
          title={user}
          className="flex items-center gap-2"
        >
          <span className="block shrink-0 size-2.5 rounded-full bg-green-800" />
          <span
            className={cn("truncate", user === username ? "font-bold" : "")}
          >
            {user}
          </span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(OnlineUserList);
