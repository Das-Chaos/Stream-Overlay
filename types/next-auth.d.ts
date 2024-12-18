import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      username: string
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    email?: string | null
    username?: string
    role?: string
  }
}
