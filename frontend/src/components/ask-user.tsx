"use client";

import { useRef, type FormEvent } from "react";

export default function AskUser({ login }: { login: (value: string) => void }) {
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const handleUsernameSet = (e: FormEvent) => {
    e.preventDefault();
    if (!usernameRef.current || !usernameRef.current.value?.trim()) return;

    const username = usernameRef.current.value.trim();
    login(username);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        className="w-60 flex flex-col gap-1"
        onSubmit={handleUsernameSet}
      >
        <input
          ref={usernameRef}
          type="text"
          placeholder="enter your username"
          className="border border-black rounded-sm w-full py-1 px-2"
        />
        <button className="border border-muted-foreground rounded-sm px-4 w-full cursor-pointer">
          Set
        </button>
      </form>
    </div>
  );
}
