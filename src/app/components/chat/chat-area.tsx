"use client"
import { useAppSelector } from "@redux/hooks"
import { ChatHistory } from "@ui/radix-elements"


export const ChatArea = () => {
  const messageHistory = useAppSelector((state) => state.chat.messages)


  return (
    <ChatHistory messages={messageHistory} />
  )
}
