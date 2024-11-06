"use client"
import { useEffect } from "react"
import { fetchAllChats, pushAllChats } from "@globals/functions"
import { useUser, useSession, useSnackbar } from "@hooks/global"
import { 
  useInitialThread,
  useThreads,
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
  const { user } = useUser()
  const { session } = useSession()
  const { showMessage } = useSnackbar()
  const threads = useThreads()
  const selectedThread = useSelectedThread()
  const messageHistory = selectedThread ? selectedThread.messages : []

  useEffect(() => {
    if (user) {
      try {
        if (threads.length > 0) {
          pushAllChats(user.id, threads)
        }
        fetchAllChats(user.id)
        showMessage("success", "Chat sync successful")
      
      } catch (error) {
        showMessage("error", "Unable to sync chats")
      }
    }
  }, [user, threads])

  useEffect(() => {
    if (!session) {
      const delayTimer = setTimeout(() => {
        showMessage("info", "Trial Mode\n\n- Sign In/Up -\n to save chats")
      }, 2400)
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
        padding: { xs: "0 0 0.5rem", sm: "0 1rem 0.875rem", lg: "0 2rem 1rem 0" }
      }}>
        <ChatHistory messages={messageHistory} />
        <ChatInput />
      </FlexBox>
    </PageLayout>
  )
}
