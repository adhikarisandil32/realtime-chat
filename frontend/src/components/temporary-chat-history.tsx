import { cn } from "@/lib/utils";
import { useProtected } from "@/providers/protected";
import { useSocket } from "@/providers/socket-provider";
import { dateParse } from "@/utils/date-parse";
import React from "react";

function TemporaryHistory({
  ref: latestConversationRef,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  const { username } = useProtected();
  const { messages } = useSocket();

  return (
    <>
      {messages.map((chat, chatIdx, chatArr) => (
        <div
          key={`${chat.identifier}-${chat.createdAt}`}
          className={cn(
            "px-2 py-1 rounded-lg",
            chat.sender === username
              ? "bg-blue-800 text-gray-100 col-start-2 col-end-7"
              : "border border-muted-foreground col-start-1 col-end-6",
            chat.status === "pending" ? "bg-muted-foreground" : ""
          )}
          title={dateParse(chat.createdAt)}
          ref={(elem) => {
            if (chatIdx + 1 === chatArr.length) {
              latestConversationRef.current = elem;
            }
            // if (pageIdx + 1 === pageArr.length && chatIdx === 0) {
            //   elementToObserveForFetching(elem);
            // }
          }}
        >
          <p className="font-semibold truncate">{chat.sender}: </p>
          <p>{chat.message}</p>
        </div>
      ))}
    </>
  );
}

export default React.memo(TemporaryHistory);
