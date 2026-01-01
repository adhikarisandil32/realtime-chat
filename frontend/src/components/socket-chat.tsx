import { useSocket } from "@/providers/socket-provider";
import { useEffect, useRef, useState, type FormEvent } from "react";
import ClientCount from "./client-counts";
import ChatHistoryBox from "./chat-history-box";
import { useProtected } from "../providers/protected";
import { IClientChat } from "@/types/chat-response";
import TypingIndicator from "./typing-indictor";

function SocketChat() {
  // React.useEffect(() => {
  //   console.log("socket chat mounted");

  //   return () => console.log("socket chat unmounted");
  // });

  const inputMessageRef = useRef<HTMLInputElement | null>(null);

  const { socket, emitMessage, setMessages } = useSocket();
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
    emitMessage(messageData);
    setMessages((prev) => [...prev, messageData]);

    inputMessageRef.current.value = "";
  };

  const handleTyping = () => {
    let timeout: ReturnType<typeof setTimeout>;

    return () => {
      socket.emit("typing-on", { user: username });
      clearTimeout(timeout);

      timeout = setTimeout(
        () => socket.emit("typing-off", { user: username }),
        2 * 1000
      );
    };
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="space-y-4 w-96 relative">
        <div className="border-2 border-black h-125 overflow-auto w-full">
          <div className="sticky top-0 bg-gray-100">
            <ClientCount className="text-center font-bold " />
            <TypingIndicator className="py-1 text-sm text-muted-foreground text-center" />
          </div>

          <div className="my-1 px-2 space-y-1 grid grid-cols-6">
            <ChatHistoryBox username={username} />
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
    </div>
  );
}

export default SocketChat;
