"use client"
import { useAppSelector } from "@redux/hooks"
import { ChatHistory } from "@ui/chat-elements"
import { useInitialThread } from "@hooks/chat-initial-thread"


export const ChatArea = () => {
  const activeThread = useAppSelector((state) => state.chat.threads.find(thread => thread.active))
  const messageHistory = activeThread ? activeThread.messages : []

  useInitialThread()

  return (
    <ChatHistory messages={messageHistory} />
  )
}
