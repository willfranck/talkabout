"use client"
import { useState, useEffect } from "react"
import { useAppDispatch } from "@redux/hooks"
import { syncDbMessages, debounce } from "@globals/functions"
import { 
  useUser, 
  useSession, 
  useSnackbar 
} from "@hooks/global"
import { 
  // useInitialThread,
  useThreads,
  useSelectedThread,
  useMessages
} from "@hooks/chat"
import { PageLayout } from "@ui/mui-layout"
import { Box } from "@mui/material"
import { 
  FlexBox, 
  LoadingDialog 
} from "@ui/mui-elements"
import { ChatPanel } from "@chat/chat-panel"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export default function ChatPage() {
  // useInitialThread()
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const { session } = useSession()
  const { showMessage } = useSnackbar()
  const threads = useThreads()
  const messages = useMessages()
  const selectedThread = useSelectedThread()
  const messageHistory = selectedThread ? selectedThread.messages : []
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (!session || !user?.id) {
      setIsLoading(false)
      return
    }
    
    const syncData = async () => {
      if (debounce("sync-messages", 10000)) return

      setIsLoading(true)
      try {
        const reduxActions = await syncDbMessages(user.id, threads, messages)
        for (const action of reduxActions) {
          dispatch(action)
        }
      } catch (error) {
        showMessage("error", "Unable to sync messages")
      
      } finally {
        setIsLoading(false)
      }
    }
    syncData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, session, user?.id])

  useEffect(() => {
    if (!session) {
      const delayTimer = setTimeout(() => {
        showMessage("info", "Trial Mode\n\n- Sign In/Up -\n to save chats")
      }, 2400)
      return () => clearTimeout(delayTimer)
    }
  }, [session, showMessage])

  return (
    <PageLayout>
      <LoadingDialog open={isLoading} message="Syncing messages..." />
      
      <Box 
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
          opacity: (isLoading ? "33%" : "100%")
        }}
      >
        <ChatPanel />
      </Box>
      <FlexBox sx={{
        flexDirection: "column",
        flexGrow: "1",
        height: "100%",
        gap: "1rem",
        padding: { xs: "0 0 0.5rem", sm: "0 1rem 0.875rem", lg: "0 2rem 1rem 0" },
        opacity: (isLoading ? "33%" : "100%")
      }}>
        <ChatHistory messages={messageHistory} />
        <ChatInput />
      </FlexBox>
    </PageLayout>
  )
}
