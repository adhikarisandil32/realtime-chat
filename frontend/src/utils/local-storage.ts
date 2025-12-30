import { envConfig } from "@/config/config";

const keyPrefix = envConfig.localStoragePrefix ?? "my-app";

export const setLocal = (key: string, rawValue: any) => {
  if (rawValue == undefined || typeof window === "undefined") return;

  localStorage.setItem(`${keyPrefix}::${key}`, JSON.stringify(rawValue));
};

export const getLocal = <T = any>(key: string) => {
  if (typeof window === "undefined") return;

  const value = localStorage.getItem(`${keyPrefix}::${key}`);
  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};

export const clearLocal = () => {
  if (typeof window === "undefined") return;

  localStorage.clear();
};
