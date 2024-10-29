export type User = {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  chats: ChatThread[]
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
