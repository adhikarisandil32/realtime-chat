enum AppMode {
  Development = "DEVELOPMENT",
  Production = "PRODUCTION",
  Staging = "STAGING",
}

interface IConfig {
  apiUrl: string;
  localStoragePrefix: string;
}

const env = process.env;

export const envConfig: IConfig = {
  apiUrl: env.NEXT_PUBLIC_API_BASE_URL!,
  localStoragePrefix: env.NEXT_PUBLIC_LOCAL_STORAGE_PREFIX!,
};
