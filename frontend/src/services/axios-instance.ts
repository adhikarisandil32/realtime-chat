import { envConfig } from "@/config/config";
import axios, { AxiosError } from "axios";

interface IAxiosError extends AxiosError {
  config: AxiosError["config"] & { _retries: number };
}

const api = axios.create({
  baseURL: envConfig.apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: IAxiosError) => {
    const prevConfig = error.config;
    const maxRetries = 5;
    const retryCount = prevConfig._retries || 0;

    if (
      error.response &&
      error.response.status >= 400 &&
      retryCount < maxRetries
    ) {
      prevConfig._retries = retryCount + 1;
      return await api(prevConfig);
    }

    prevConfig._retries = 0;
    return Promise.reject(error);
  }
);

export { api };
