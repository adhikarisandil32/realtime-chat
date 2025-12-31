"use client";

import { getLocal } from "@/utils/local-storage";
import dynamic from "next/dynamic";

const AskUser = dynamic(() => import("@/components/ask-user"), {
  ssr: false,
});
const SocketChat = dynamic(() => import("@/components/socket-chat"), {
  ssr: false,
});
const SocketProvider = dynamic(() => import("@/providers/socket-provider"));

export default function Home() {
  const username = getLocal("username");

  if (!username) {
    return <AskUser />;
  } else {
    return (
      <SocketProvider>
        <SocketChat username={username} />
      </SocketProvider>
    );
  }
}
