declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      HARD_TOKEN: string;
      AUTH_SECRET_KEY: string;
      NODE_ENV: string;
      CLIENT_AUTH_SECRET_KEY: string;
      ADMIN_AUTH_SECRET_KEY: string;
      MINIO_BUCKET_NAME: string;
      MINIO_ENDPOINT: string;
      MINIO_PORT: number;
      MINIO_USE_SSL: boolean;
      MINIO_ACCESS_KEY: string;
      MINIO_SECRET_KEY: string;
    }
  }
}
