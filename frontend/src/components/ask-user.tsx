"use client";

import { setLocal } from "@/utils/local-storage";
import { useRef, type FormEvent } from "react";

export default function AskUser() {
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const handleUsernameSet = (e: FormEvent) => {
    e.preventDefault();
    if (!usernameRef.current || !usernameRef.current.value?.trim()) return;

    setLocal("username", usernameRef.current.value.trim());
    window.location.reload();
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
          className="border border-black rounded-sm w-full px-1"
        />
        <button className="border border-black rounded-sm px-4 w-fit">
          Set
        </button>
      </form>
    </div>
  );
}
