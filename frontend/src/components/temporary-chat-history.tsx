import { cn } from "@/lib/utils";
import { useProtected } from "@/providers/protected";
import {
  useSocketGetters,
  useSocketSetters,
} from "@/providers/socket-provider";
import { dateParse } from "@/utils/date-parse";
import React, { useEffect } from "react";

function TemporaryHistory() {
  const { username } = useProtected();
  const { scrollToLatest, emptyMessageElement } = useSocketSetters();
  const { messages } = useSocketGetters();

  useEffect(() => {
    // is the state of messages has changed and scrollToLatest is set to true, only then the it is scrolled to latest message
    if (scrollToLatest.current) {
      emptyMessageElement.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      scrollToLatest.current = false;
    }
  }, [messages]);

  return (
    <>
      {messages.map((chat) => (
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
        >
          <p className="font-semibold truncate">{chat.sender}: </p>
          <p>{chat.message}</p>
        </div>
      ))}

      <div
        ref={emptyMessageElement}
        className="col-span-full"
      />
    </>
  );
}

export default React.memo(TemporaryHistory);
