"use client"
import { useSelectedThread } from "@hooks/chat"
import { FlexBox } from "@ui/mui-elements"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export const ChatArea = () => {
  const selectedThread = useSelectedThread()
  const messageHistory = selectedThread ? selectedThread.messages : []

  return (
    <FlexBox sx={{
      flexDirection: "column",
      flexGrow: "1",
      height: "100%",
      gap: "1rem",
      padding: { xs: "0", md: "0 2rem 1rem 0"}
    }}>
      <ChatHistory messages={messageHistory} />
      <ChatInput />
    </FlexBox>
  )
}
