import { useSocket } from "@/providers/socket-provider";
import { useRef, type FormEvent } from "react";
import ClientCount from "./client-counts";
import ChatHistoryBox from "./chat-history-box";
import { useProtected } from "../providers/protected";
import { IClientChat } from "@/types/chat-response";
import TypingIndicator from "./typing-indictor";
import OnlineUsersList from "./online-users-list";

function SocketChat() {
  const inputMessageRef = useRef<HTMLInputElement | null>(null);
  const scrollingElement = useRef<HTMLDivElement | null>(null);

  const { socket, emitMessage, setMessages, scrollToLatest } = useSocket();
  const { username, logout } = useProtected();

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessageRef.current?.value.trim()) return;

    const message = inputMessageRef.current.value.trim();
    const messageData: IClientChat = {
      sender: username,
      message,
      createdAt: new Date().getTime(),
      status: "pending",
      identifier: crypto.randomUUID(),
    };
    inputMessageRef.current.value = "";
    scrollToLatest.current = true;

    emitMessage(messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  const handleTyping = () => {
    let timeout: ReturnType<typeof setTimeout>;
    let lastTime: number = 0;

    return () => {
      const currentTime = Date.now();
      if (currentTime - lastTime >= 2 * 1000) {
        socket.emit("typing-on", { user: username });
        lastTime = currentTime;
      }

      clearTimeout(timeout);

      timeout = setTimeout(
        () => socket.emit("typing-off", { user: username }),
        1.5 * 1000
      );
    };
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex gap-4 items-start">
        <div className="space-y-4 w-96 relative">
          <div
            className="border-2 border-black h-125 overflow-auto w-full"
            ref={scrollingElement}
          >
            <div className="sticky top-0 z-10 bg-gray-100">
              <h2 className="text-center font-bold">Conversation Box</h2>
              <TypingIndicator className="py-1 text-sm text-muted-foreground text-center" />
            </div>

            <div className="my-1 px-2 space-y-1 grid grid-cols-6 border-2 border-black relative">
              <ChatHistoryBox
                scrollingElement={scrollingElement}
                username={username}
              />
            </div>
          </div>

          <form
            className="flex w-full flex-wrap gap-1"
            onSubmit={handleSend}
          >
            <input
              ref={inputMessageRef}
              onKeyDown={handleTyping()}
              type="text"
              placeholder="Enter message"
              className="border border-black rounded-sm w-full py-1 px-2"
            />
            <div className="flex justify-between w-full">
              <button
                type="button"
                className="text-gray-100 bg-red-600 rounded-sm px-4 w-fit"
                onClick={() => {
                  socket.disconnect();
                  logout();
                }}
              >
                Exit
              </button>

              <button
                type="submit"
                className="border border-black rounded-sm px-4 w-fit"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-auto max-h-125 w-63 border-2 border-black">
          <h2 className="font-bold text-center bg-gray-100 top-0 sticky">
            Online Users <ClientCount />
          </h2>

          <div className="mt-1">
            <OnlineUsersList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocketChat;
