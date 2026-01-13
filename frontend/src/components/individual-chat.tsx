import { cn } from "@/lib/utils";
import { IChatResponse } from "@/types/chat-response";
import { dateParse } from "@/utils/date-parse";

export default function IndividualChat({
  chat,
  username,
}: {
  chat: IChatResponse;
  username: string;
}) {
  return (
    <div
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
  );
}
