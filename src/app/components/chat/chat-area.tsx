"use client"
import { useAppSelector } from "@redux/hooks"
import { ChatHistory } from "@ui/chat-elements"


export const ChatArea = () => {
  const activeThread = useAppSelector((state) => state.chat.threads.find(thread => thread.active))
  const messageHistory = activeThread ? activeThread.messages : []

  return (
    <ChatHistory messages={messageHistory} />
  )
}
