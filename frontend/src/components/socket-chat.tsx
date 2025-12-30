import { envConfig } from "@/config/config";
import { clearLocal } from "@/utils/local-storage";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { io } from "socket.io-client";

interface SocketConnectionProps {
  username: string;
}

interface IConversation {
  sender: string;
  message: string;
  createdAt: string;
}

const socket = io(envConfig.apiUrl);

function SocketChat({ username }: SocketConnectionProps) {
  const inputMessageRef = useRef<HTMLInputElement | null>(null);
  const latestConversationRef = useRef<HTMLDivElement | null>(null);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [connectedClient, setConnectedClients] = useState<number>(0);

  useEffect(() => {
    latestConversationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [conversations]);

  useEffect(() => {
    const messageListener = (data: IConversation) => {
      setConversations((prev) => [...prev, data]);
    };

    const countListener = (count: number) => setConnectedClients(count);

    socket.on("client-count", countListener);
    socket.on("message", messageListener);

    return () => {
      socket.off("message", messageListener);
      socket.off("client-count", countListener);
    };
  }, []);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();

    if (!inputMessageRef.current?.value.trim()) return;

    const message = inputMessageRef.current.value;

    socket.emit("message", { sender: username, message });
    inputMessageRef.current.value = "";
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="space-y-4 w-80 relative">
        <div className="border-2 border-black h-90 overflow-auto w-full">
          <h2 className="text-center font-bold bg-gray-100 sticky top-0">
            Conversation Box ({connectedClient}{" "}
            {`${connectedClient > 1 ? "Users" : "User"}`})
          </h2>
          <div className="my-1 px-2 space-y-1 grid grid-cols-6">
            {conversations.map((conversation, idx, initialArr) => (
              <div
                key={`${conversation.sender}-${conversation.message}`}
                className={`px-2 py-1 rounded-lg ${
                  conversation.sender === username
                    ? "bg-blue-800 text-gray-100 col-start-2 col-end-7"
                    : "border border-black col-start-1 col-end-6"
                }`}
                ref={
                  idx + 1 === initialArr.length ? latestConversationRef : null
                }
              >
                <p className="font-semibold">{conversation.sender}: </p>
                <p>{conversation.message}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          className="flex w-full flex-wrap gap-1"
          onSubmit={handleSend}
        >
          <input
            ref={inputMessageRef}
            type="text"
            placeholder="Enter message"
            className="border border-black rounded-sm w-full px-1"
          />
          <div className="flex justify-between w-full">
            <button
              type="submit"
              className="border border-black rounded-sm px-4 w-fit"
            >
              Send
            </button>

            <button
              type="button"
              className="text-gray-100 bg-red-600 rounded-sm px-4 w-fit"
              onClick={() => {
                clearLocal();
                window.location.reload();
              }}
            >
              Exit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SocketChat;
