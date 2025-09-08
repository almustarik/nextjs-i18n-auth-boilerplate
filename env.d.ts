declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string
    GITHUB_ID?: string
    GITHUB_SECRET?: string
    NEXT_PUBLIC_API_BASE_URL?: string
    NEXT_PUBLIC_APP_URL: string
  }
}
