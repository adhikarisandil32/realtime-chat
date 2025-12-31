import { useInfiniteChats } from "@/services/api/chats";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

export default function ChatHistoryBox({ username }: { username: string }) {
  const {
    data: chats,
    isPending,
    isSuccess,
    fetchNextPage,
  } = useInfiniteChats();
  const latestConversationRef = useRef<HTMLDivElement | null>(null);
  const elementToObserveForFetching = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    latestConversationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  // console.log({ isPending, isSuccess });

  const {} = useIntersectionObserver({
    threshold: 0,
  });

  return (
    <>
      <button
        className="col-span-full px-2 py-1 border border-foreground rounded-sm"
        onClick={() => fetchNextPage()}
      >
        Load More
      </button>

      {[...chats.pages].reverse().map((page, pageIdx, pageArr) =>
        page.data.map((chat, chatIdx, chatArr) => (
          <div
            key={`${chat.sender}-${chat.createdAt}`}
            className={`px-2 py-1 rounded-lg ${
              chat.sender === username
                ? "bg-blue-800 text-gray-100 col-start-2 col-end-7"
                : "border border-black col-start-1 col-end-6"
            }`}
            ref={(elem) => {
              if (chatIdx + 1 === chatArr.length && pageIdx === 0) {
                latestConversationRef.current = elem;
              }
              if (pageIdx === 0 && chatIdx === 0) {
                elementToObserveForFetching.current = elem;
              }
            }}
            // ref={idx + 1 === arr.length ? latestConversationRef : null}
          >
            <p className="font-semibold truncate">{chat.sender}: </p>
            <p>{chat.message}</p>
          </div>
        ))
      )}
    </>
  );
}
