/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_TOKEN_EXPIRY: string
  readonly VITE_ENABLE_3D_SCENE: string
  readonly VITE_ENABLE_SOUND: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.glsl' {
  const value: string
  export default value
}
