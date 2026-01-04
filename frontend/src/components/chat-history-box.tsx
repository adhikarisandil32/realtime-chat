import { useInfiniteChats } from "@/services/api/chats";
import React, { useEffect, useRef } from "react";
import Loading from "./loading-animation";
import { dateParse } from "@/utils/date-parse";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import TemporaryHistory from "./temporary-chat-history";

function ChatHistoryBox({
  scrollingElement,
  username,
}: {
  scrollingElement: React.RefObject<HTMLDivElement | null>;
  username: string;
}) {
  const {
    data: chats,
    isPending,
    isSuccess,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteChats();

  const { setMessages, scrollToLatest, emptyMessageElement } = useSocket();

  const elementToWatchForRefetch = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages((prev) =>
      prev.filter((message) => message.status === "pending")
    );
  }, [chats]);

  useEffect(() => {
    scrollToLatest.current = true;
    setMessages((prev) => [...prev]);
  }, [isSuccess]);

  useEffect(() => {
    const listenerFn = () => {
      console.log({
        scrollingElement: scrollingElement.current,
        scrollHeight: scrollingElement.current?.scrollHeight,
        scrollTop: scrollingElement.current?.scrollTop,
        offsetParent: emptyMessageElement.current?.offsetParent,
        offsetTop: emptyMessageElement.current?.offsetTop,
      });
    };

    scrollingElement.current?.addEventListener("scroll", listenerFn);

    return () => {
      scrollingElement.current?.removeEventListener("scroll", listenerFn);
    };
  }, [chats]);

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
      <div ref={elementToWatchForRefetch} />

      {isFetchingNextPage ? (
        <Loading />
      ) : hasNextPage ? null : (
        <p className="text-center text-sm text-muted-foreground col-span-full">
          You&apos;ve reached the top of the conversation
        </p>
      )}

      {[...chats.pages].reverse().map((page) =>
        page.data.map((chat) => (
          <div
            key={`${chat.id}-${chat.createdAt}`}
            className={cn(
              "px-2 py-1 rounded-lg",
              chat.sender === username
                ? "bg-blue-800 text-gray-100 col-start-2 col-end-7"
                : "border border-muted-foreground col-start-1 col-end-6"
            )}
            title={dateParse(chat.createdAt)}
          >
            <p className="font-semibold truncate">{chat.sender}:</p>
            <p className="text-sm">{chat.message}</p>
          </div>
        ))
      )}

      <TemporaryHistory />
    </>
  );
}

export default React.memo(ChatHistoryBox);
