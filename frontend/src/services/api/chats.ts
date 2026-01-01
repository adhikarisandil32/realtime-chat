import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { api } from "../axios-instance";
import { queryKeys } from "@/utils/react-query-keys";
import { IPaginatedResponse } from "@/types/paginaed-response";
import { IChatResponse } from "@/types/chat-response";

export const useChats = (config?: AxiosRequestConfig) => {
  return useSuspenseQuery<IPaginatedResponse<IChatResponse>>({
    queryKey: [queryKeys.chats],
    queryFn: async () => {
      return await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await api.get("/api/chats", config);
            resolve(response.data);
          } catch (error) {
            reject(error);
          }
        }, 1 * 1000);
      });
    },
  });
};

export const useInfiniteChats = (config?: AxiosRequestConfig) => {
  return useInfiniteQuery<IPaginatedResponse<IChatResponse>>({
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) => pagination.nextPage ?? null,
    getPreviousPageParam: ({ pagination }) => pagination.prevPage ?? null,
    queryKey: [queryKeys.chats],
    queryFn: async ({ pageParam }) => {
      // await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
      try {
        const response = await api.get("/api/chats", {
          ...config,
          params: {
            ...config?.params,
            page: pageParam,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};
