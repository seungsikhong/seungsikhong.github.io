/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_VIEW_COUNTER_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
