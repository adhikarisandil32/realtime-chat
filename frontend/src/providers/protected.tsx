"use client";

import { clearLocal, getLocal, setLocal } from "@/utils/local-storage";
import React, { SetStateAction } from "react";
import AskUser from "../components/ask-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface IAuthProviderContext {
  username: string;
  login: (value: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<IAuthProviderContext | undefined>(
  undefined
);

export const useProtected = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("use auth context within its provider");
  }

  return context;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Protected({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState(() => getLocal("username"));

  const login = (user: string) => {
    setLocal("username", user);
    setUsername(user);
  };

  const logout = () => {
    clearLocal();
    setUsername(undefined);
  };

  if (!username) {
    return <AskUser login={login} />;
  }

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  );
}
