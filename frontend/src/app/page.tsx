"use client";

import dynamic from "next/dynamic";

const Protected = dynamic(() => import("@/providers/protected"), {
  ssr: false,
});
const SocketProvider = dynamic(() => import("@/providers/socket-provider"), {
  ssr: false,
});
const SocketChat = dynamic(() => import("@/components/socket-chat"), {
  ssr: false,
});

export default function Home() {
  return (
    <Protected>
      <SocketProvider>
        <SocketChat />
      </SocketProvider>
    </Protected>
  );
}
