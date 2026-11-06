// src/config/index.ts

declare const process: {
  env: Record<string, string | undefined>;
};

const appEnv = process.env.EXPO_PUBLIC_APP_ENV ?? process.env.APP_ENV ?? 'development';
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? process.env.API_URL ?? 'https://api-dev.briminds.ai/api';
const appName = process.env.EXPO_PUBLIC_APP_NAME ?? process.env.APP_NAME ?? 'BriMinds Dev';
const webURL = process.env.EXPO_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? 'http://192:168.1.117:3000';

const ENV = {
  name: appEnv,
  webURL: webURL,
  apiUrl: apiUrl,
  appName: appName,
  isDev: appEnv !== 'production',
};

export default ENV;
