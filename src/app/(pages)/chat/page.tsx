"use client"
import { useEffect } from "react"
import { useSession, useSnackbar } from "@hooks/global"
import { 
  useInitialThread,
  useSelectedThread 
} from "@hooks/chat"
import { PageLayout } from "@ui/mui-layout"
import { Box } from "@mui/material"
import { FlexBox } from "@ui/mui-elements"
import { ChatPanel } from "@chat/chat-panel"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export default function ChatPage() {
  useInitialThread()
  const { session } = useSession()
  const { showMessage } = useSnackbar()
  const selectedThread = useSelectedThread()
  const messageHistory = selectedThread ? selectedThread.messages : []

  useEffect(() => {
    if (!session) {
      const delayTimer = setTimeout(() => {
        showMessage("info", "Trial Mode\n\n- Sign In/Up -\n to save chats")
      }, 1200)
      return () => clearTimeout(delayTimer)
    }
  }, [session])

  return (
    <PageLayout>
      <Box 
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%"
        }}
      >
        <ChatPanel />
      </Box>
      <FlexBox sx={{
        flexDirection: "column",
        flexGrow: "1",
        height: "100%",
        gap: "1rem",
        padding: { xs: "0", sm: "0 1rem 0.75rem", lg: "0 2rem 1rem 0" }
      }}>
        <ChatHistory messages={messageHistory} />
        <ChatInput />
      </FlexBox>
    </PageLayout>
  )
}
