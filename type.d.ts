declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      HARD_TOKEN: string;
      AUTH_SECRET_KEY: string;
    }
  }
}
