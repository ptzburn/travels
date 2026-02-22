interface ImportMetaEnv {
  readonly VITE_HOST_URL: string;
  readonly VITE_S3_ENDPOINT: string;
  readonly VITE_S3_BUCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
