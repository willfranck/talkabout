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
}

export type SupabaseMessage = {
  id: string
  local_id: string
  thread_id: string
  local_thread_id: string
  role: "user" | "model"
  content: string
  timestamp: string
}

export type ChatMessage = {
  id: string
  threadId: string
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

export const transformSupabaseUser = (user: SupabaseUser, chats: ChatThread[] = []): User => {
  return {
    id: user.id,
    email: user.email,
    created: user.created_at,
    lastSignIn: user.last_sign_in_at,
    firstName: user.user_metadata.first_name,
    lastName: user.user_metadata.last_name,
    avatar: user.user_metadata.avatar_url,
    chats
  }
}

export const transformSupabaseThread = (thread: SupabaseThread): ChatThread => {
  return {
    id: thread.local_id,
    topic: thread.topic,
    category: thread.category,
    created: thread.created,
    lastActive: thread.last_active,
    selected: false,
    messages: []
  };
}

export const transformSupabaseMessage = (message: SupabaseMessage): ChatMessage => {
  return {
    id: message.local_id,
    threadId: message.local_thread_id,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp
  }
}

export const transformChatThread = (userId: string, thread: ChatThread): Omit<SupabaseThread, "id"> => {
  const currentTime = new Date().toISOString()
  return {
    user_id: userId,
    local_id: thread.id,
    topic: thread.topic,
    category: thread.category,
    created: thread.created,
    last_active: currentTime
  }
}

export const transformChatMessage = (threadId: string, message: ChatMessage): Omit<SupabaseMessage, "id"> => {
  return {
    thread_id: threadId,
    local_id: message.id,
    local_thread_id: message.threadId,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp
  }
}
