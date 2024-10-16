"use client"
import { useActiveThread } from "@hooks/chat"
import { Flex } from "@radix-ui/themes"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export const ChatArea = () => {
  const activeThread = useActiveThread()
  const messageHistory = activeThread ? activeThread.messages : []

  return (
    <Flex 
      direction="column" 
      gap="6" 
      flexGrow="1" 
      pb="4" 
      className="flex-1 h-page-content"
    >
      <ChatHistory messages={messageHistory} />
      <ChatInput />
    </Flex>
  )
}
