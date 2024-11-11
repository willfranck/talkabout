"use client"
import { useEffect } from "react"
import { useAppDispatch } from "@redux/hooks"
import { syncDbMessages, debounce } from "@globals/functions"
import { 
  useUser, 
  useSession, 
  useSnackbar 
} from "@hooks/global"
import { 
  useInitialThread,
  useThreads,
  useMessages,
  useThreadMessageHistory
} from "@hooks/chat"
import { PageLayout } from "@ui/mui-layout"
import { Box } from "@mui/material"
import { 
  FlexBox
} from "@ui/mui-elements"
import { ChatPanel } from "@chat/chat-panel"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export default function ChatPage() {
  useInitialThread()
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const { session } = useSession()
  const { showMessage } = useSnackbar()
  const threads = useThreads()
  const messages = useMessages()
  const messageHistory = useThreadMessageHistory()
  
  useEffect(() => {
    if (!session || !user?.id) return
    
    const syncData = async () => {
      if (debounce("sync-messages", 10000)) return

      try {
        const result = await syncDbMessages(user.id, threads, messages)
        result.actions.forEach(action => 
          dispatch(action)
        )
      } catch (error) {
        console.log(error)
        showMessage("error", "Unable to sync messages", 3000)
      }
    }
    syncData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, session, user?.id])

  useEffect(() => {
    if (!session) {
      const delayTimer = setTimeout(() => {
        showMessage("info", "   Trial Mode\n\n- Sign In/Up -\n to save chats", 6000)
      }, 2400)
      return () => clearTimeout(delayTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
