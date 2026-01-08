import { useInfiniteChats } from "@/services/api/chats";
import React, { useCallback, useEffect } from "react";
import Loading from "./loading-animation";
import { dateParse } from "@/utils/date-parse";
import { cn } from "@/lib/utils";
import {
  useSocketGetters,
  useSocketSetters,
} from "@/providers/socket-provider";
import TemporaryHistory from "./temporary-chat-history";

function ChatHistoryBox({
  // scrollContainer,
  username,
}: {
  // scrollContainer: React.RefObject<HTMLDivElement | null>;
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

  const { setMessages } = useSocketSetters();
  const { scrollToLatest } = useSocketGetters();
  // const {username} = useProtected()

  // const elementToWatchForRefetch = useRef<HTMLDivElement | null>(null);
  const elementToWatchForRefetchCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 0,
        }
      );
      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    },
    [hasNextPage]
  );

  useEffect(() => {
    setMessages((prev) =>
      prev.filter((message) => message.status === "pending")
    );
  }, [chats]);

  useEffect(() => {
    scrollToLatest.current = true;
    setMessages((prev) => [...prev]);
  }, [isSuccess]);

  // useEffect(() => {}, [chats]);

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
      <div
        ref={elementToWatchForRefetchCallback}
        className="col-span-full"
      />

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
