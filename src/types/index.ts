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
  created: string
  active: boolean
}
