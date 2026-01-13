import { useSocketGetters } from "@/providers/socket-provider";
import { useEffect, useState } from "react";

export default function TypingIndicator({ className }: { className?: string }) {
  const { socket } = useSocketGetters();
  const [isTyping, setIsTyping] = useState({ state: false, users: [] });

  useEffect(() => {
    socket.on("typing-on", (users) => setIsTyping({ state: true, users }));
    socket.on("typing-off", (users) => setIsTyping({ state: false, users }));

    return () => {
      socket.off("typing-on");
      socket.off("typing-off");
    };
  }, []);

  const top3TypingUsers =
    isTyping.users.length > 2
      ? `${isTyping.users[0]}, ${isTyping.users[1]} and more typing...`
      : `${isTyping.users.join(" and ")} typing...`;

  return isTyping.state ? (
    <p className={className}>({top3TypingUsers})</p>
  ) : null;
}
