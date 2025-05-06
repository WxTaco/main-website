/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDFLARE_ACCOUNT_ID: string;
  readonly VITE_CLOUDFLARE_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
