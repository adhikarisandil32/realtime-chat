import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";

export default function TypingIndicator({ className }: { className?: string }) {
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState({ state: false, user: null });

  useEffect(() => {
    socket.on("typing-on", (user) => setIsTyping({ state: true, user }));
    socket.on("typing-off", (user) => setIsTyping({ state: false, user }));

    return () => {
      socket.off("typing-on");
      socket.off("typing-off");
    };
  });

  return isTyping.state ? (
    <p className={className}>({isTyping.user} is typing...)</p>
  ) : null;
}
