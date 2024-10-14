export type ChatMessage = {
  id: string
  role: "user" | "model"
  content: string
  date: string
}

export type ChatThread = {
  id: string
  topic: string
  messages: ChatMessage[]
  category: "active" | "archived"
  created: string
  active: boolean
  lastActive: string
}
