import { useInfiniteChats } from "@/services/api/chats";
import React, { useCallback, useEffect } from "react";
import Loading from "./loading-animation";
import { dateParse } from "@/utils/date-parse";
import { cn } from "@/lib/utils";
import { useSocketSetters } from "@/providers/socket-provider";
import TemporaryHistory from "./temporary-chat-history";
import { List, useDynamicRowHeight } from "react-window";
import IndividualChat from "./individual-chat";

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
  // const { scrollToLatest } = useSocketGetters();
  // const {username} = useProtected()
  const dynamicHeight = useDynamicRowHeight({
    defaultRowHeight: 20,
  });

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

  // useEffect(() => {
  //   scrollToLatest.current = true;
  //   setMessages((prev) => [...prev]);
  // }, [isSuccess]);

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

      <List
        className="col-span-full grid grid-cols-1"
        rowComponent={IndividualChat}
        rowProps={{
          chats: [],
          username,
        }}
        rowCount={chats.pages[0].pagination.total}
        rowHeight={20}
      />

      {/* {[...chats.pages].reverse().map((page) =>
        page.data.map((chat) => (
          <IndividualChat
            key={`${chat.id}-${chat.createdAt}`}
            chat={chat}
            username={username}
          />
        ))
      )} */}

      <TemporaryHistory />
    </>
  );
}

export default React.memo(ChatHistoryBox);
