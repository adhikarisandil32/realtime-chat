import { useInfiniteChats } from "@/services/api/chats";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import Loading from "./loading-animation";
import {
  useSocketGetters,
  useSocketSetters,
} from "@/providers/socket-provider";
import TemporaryHistory from "./temporary-chat-history";
import IndividualChat from "./individual-chat";

function ChatHistoryBox({
  // chatsContainer,
  username,
}: {
  // chatsContainer: React.RefObject<HTMLDivElement | null>;
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
  const {
    scrollToLatest,
    chatsScrollContainerElem,
    chatsScrollElemPrevMeasurements,
  } = useSocketGetters();

  useLayoutEffect(() => {
    if (!chatsScrollContainerElem.current) return;

    if (!chatsScrollElemPrevMeasurements.current) {
      chatsScrollContainerElem.current.scrollTop =
        chatsScrollContainerElem.current.scrollHeight;
    } else {
      const prevScrollHeight =
        chatsScrollElemPrevMeasurements.current.scrollHeight;

      chatsScrollContainerElem.current.scrollTop =
        chatsScrollContainerElem.current.scrollHeight - prevScrollHeight;
    }
  }, [chats]);

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
          root: chatsScrollContainerElem.current,
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
    scrollToLatest.current = false;
    setMessages((prev) =>
      prev.filter((message) => message.status === "pending")
    );

    return () => {
      if (!chatsScrollContainerElem.current) return;

      const measurements = {
        scrollHeight: chatsScrollContainerElem.current.scrollHeight,
        scrollTop: chatsScrollContainerElem.current.scrollTop,
      };

      chatsScrollElemPrevMeasurements.current = measurements;
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

      {/* <List
        className="col-span-full grid grid-cols-1"
        rowComponent={IndividualChat}
        rowProps={{
          chats: chats.pages.map((page) => page.data.map((chat) => chat)),
          username,
        }}
        rowCount={chats.pages[0].pagination.total}
        rowHeight={dynamicHeight}
      /> */}

      {[...chats.pages].reverse().map((page) =>
        page.data.map((chat) => (
          <IndividualChat
            key={`${chat.id}-${chat.createdAt}`}
            chat={chat}
            username={username}
          />
        ))
      )}

      <TemporaryHistory />
    </>
  );
}

export default React.memo(ChatHistoryBox);
