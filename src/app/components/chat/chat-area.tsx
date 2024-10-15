"use client"
import { ChatHistory } from "@ui/chat-elements"
import { useActiveThread } from "@hooks/chat"


export const ChatArea = () => {
  const activeThread = useActiveThread()
  const messageHistory = activeThread ? activeThread.messages : []

  return (
    <ChatHistory messages={messageHistory} />
  )
}
