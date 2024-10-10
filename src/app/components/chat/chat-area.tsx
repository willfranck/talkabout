"use client"
import { useAppSelector } from "@redux/hooks"
import { ChatHistory } from "@ui/radix-elements"
import { useInitialThread } from "@hooks/chat-initial-thread"


export const ChatArea = () => {
  useInitialThread()
  const activeThread = useAppSelector((state) => state.chat.threads.find(thread => thread.active))
  const messageHistory = activeThread ? activeThread.messages : []


  return (
    <ChatHistory messages={messageHistory} />
  )
}
