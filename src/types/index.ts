export type User = {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  chats: ChatThread[]
}

export type SupabaseUser = {
  id: string
  aud: string
  role: string
  email: string
  email_confirmed_at: string
  phone?: string
  last_sign_in_at: string
  app_metadata: {
    provider: string
    providers: string[]
  }
  user_metadata: {
    first_name: string
    last_name: string
    email: string
    email_verified: boolean
    phone_verified: boolean
    sub: string
  }
  identities: Array<{
    identity_id: string
    id: string
    user_id: string
    identity_data: {
      email: string
      email_verified: boolean
      phone_verified: boolean
      sub: string
    }
    provider: string
    last_sign_in_at: string
    created_at: string
    updated_at: string
    email: string
  }>
  created_at: string
  updated_at: string
  is_anonymous: boolean
}

export interface SupabaseSession {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: SupabaseUser
}

export interface SupabaseRes {
  success: boolean
  error?: string
  message?: string
  user?: SupabaseUser
  session?: SupabaseSession
}

export type ChatMessage = {
  id: string
  role: "user" | "model"
  content: string
  timestamp: string
}

export type ChatThread = {
  id: string
  topic: string
  messages: ChatMessage[]
  category: "active" | "archived"
  created: string
  selected: boolean
  lastActive: string
}
