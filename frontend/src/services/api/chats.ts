import { useSuspenseQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { api } from "../axios-instance";
import { queryKeys } from "@/utils/react-query-keys";

export const useChats = <T = any>(config?: AxiosRequestConfig) => {
  return useSuspenseQuery<T>({
    queryKey: [queryKeys.chats],
    queryFn: async () => {
      return await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await api.get("/api/chats", config);
            resolve(response as T);
          } catch (error) {
            reject(error);
          }
        }, 10 * 1000);
      });
    },
  });
};
