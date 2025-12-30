import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: "prod" | "dev";
  ALLOWED_CORS_ORIGINS: string[] | undefined;
}

export const config: Config = {
  NODE_ENV: (process.env.NODE_ENV as Config["NODE_ENV"]) || "dev",
  PORT: +process.env.PORT! || 3000,
  ALLOWED_CORS_ORIGINS: process.env.ALLOWED_CORS_ORIGINS?.split(","),
};
