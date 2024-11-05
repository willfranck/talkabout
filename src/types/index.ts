export type User = {
  id: string
  email: string
  created: string
  lastSignIn: string
  firstName: string
  lastName: string
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
    // Data from Google OAuth
    iss?: string
    full_name?: string
    avatar_url?: string
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
  session?: SupabaseSession
  user?: SupabaseUser
  chatThreads?: SupabaseThread[]
  chatMessages?: SupabaseMessage[]
}

export type SupabaseThread = {
  id: string
  user_id: string
  local_id: string
  topic: string
  category: "active" | "archived"
  created: string
  last_active: string
  selected: boolean
}

export type SupabaseMessage = {
  id: string
  local_id: string
  thread_id: string
  role: "user" | "model"
  content: string
  timestamp: string
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

export const transformSupabaseUser = (supabaseUser: SupabaseUser, chats: ChatThread[] = []): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    created: supabaseUser.created_at,
    lastSignIn: supabaseUser.last_sign_in_at,
    firstName: supabaseUser.user_metadata.first_name,
    lastName: supabaseUser.user_metadata.last_name,
    avatar: supabaseUser.user_metadata.avatar_url,
    chats
  }
}

export const transformSupabaseThread = (supabaseThread: SupabaseThread): ChatThread => {
  return {
    id: supabaseThread.local_id,
    topic: supabaseThread.topic,
    category: supabaseThread.category,
    created: supabaseThread.created,
    lastActive: supabaseThread.last_active,
    selected: supabaseThread.selected,
    messages: []
  };
}

export const transformSupabaseMessage = (supabaseMessage: SupabaseMessage): ChatMessage => {
  return {
    id: supabaseMessage.local_id,
    role: supabaseMessage.role,
    content: supabaseMessage.content,
    timestamp: supabaseMessage.timestamp
  }
}
