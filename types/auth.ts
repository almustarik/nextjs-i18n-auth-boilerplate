export type { SessionUser } from "./entities"

export interface AuthSession {
  user: SessionUser
  expires: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface DemoUser {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}
