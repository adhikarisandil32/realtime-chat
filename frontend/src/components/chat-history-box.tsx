import { useInfiniteChats } from "@/services/api/chats";
import React, { useEffect, useRef } from "react";
import Loading from "./loading-animation";
import { dateParse } from "@/utils/date-parse";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import TemporaryHistory from "./temporary-chat-history";
import { useIntersectionObserver } from "usehooks-ts";

function ChatHistoryBox({ username }: { username: string }) {
  const {
    data: chats,
    isPending,
    isSuccess,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteChats();

  const { setMessages } = useSocket();
  const { isIntersecting, ref: firstConversationRef } = useIntersectionObserver(
    { threshold: 0 }
  );

  useEffect(() => {
    setMessages((prev) =>
      prev.filter((message) => message.status === "pending")
    );
  }, [chats]);

  useEffect(() => {
    if (isIntersecting) {
      fetchNextPage();
    }
  }, [isIntersecting, fetchNextPage]);
  // console.log({ isIntersecting });

  if (isPending) {
    return <Loading />;
  }

  if (isError || !isSuccess) {
    return (
      <div className="col-span-full text-sm text-red-400 text-center">
        Failed to load messages
      </div>
    );
  }

  return (
    <>
      {isFetchingNextPage ? (
        <Loading />
      ) : hasNextPage ? null : (
        <p className="text-center text-sm text-muted-foreground col-span-full">
          You&apos;ve reached the top of the conversation
        </p>
      )}

      {[...chats.pages].reverse().map((page, pageIdx) =>
        page.data.map((chat, chatIdx) => (
          <div
            key={`${chat.id}-${chat.createdAt}`}
            className={cn(
              "px-2 py-1 rounded-lg",
              chat.sender === username
                ? "bg-blue-800 text-gray-100 col-start-2 col-end-7"
                : "border border-muted-foreground col-start-1 col-end-6"
            )}
            title={dateParse(chat.createdAt)}
            ref={(elem) => {
              if (chatIdx === 0 && pageIdx === 0) {
                firstConversationRef(elem);
              }
            }}
          >
            <p className="font-semibold truncate">{chat.sender}: </p>
            <p>{chat.message}</p>
          </div>
        ))
      )}

      <TemporaryHistory />
    </>
  );
}

export default React.memo(ChatHistoryBox);
