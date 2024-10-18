"use client"
import { useActiveThread } from "@hooks/chat"
import { FlexBox } from "@ui/mui-elements"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export const ChatArea = () => {
  const activeThread = useActiveThread()
  const messageHistory = activeThread ? activeThread.messages : []

  return (
    <FlexBox sx={{
      flexDirection: "column",
      flexGrow: "1",
      height: "100%",
      gap: "1rem",
      padding: "0 2rem 1rem 0"
    }}>
      <ChatHistory messages={messageHistory} />
      <ChatInput />
    </FlexBox>
  )
}
