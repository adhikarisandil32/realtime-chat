"use client";

import { getLocal } from "@/utils/local-storage";
import dynamic from "next/dynamic";

const AskUser = dynamic(() => import("@/components/ask-user"), {
  ssr: false,
});
const SocketChat = dynamic(() => import("@/components/socket-chat"), {
  ssr: false,
});

export default function Home() {
  const username = getLocal("username");

  if (username) {
    return <SocketChat username={username} />;
  } else {
    return <AskUser />;
  }
}
