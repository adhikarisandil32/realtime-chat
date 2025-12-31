import { useChats } from "@/services/api/chats";

export default function ChatHistoryBox() {
  const { data: chats, isPending, isError, isSuccess } = useChats();
  return <div></div>;
}
