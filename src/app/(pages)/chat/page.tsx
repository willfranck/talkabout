"use client"
import { useEffect } from "react"
import { useAppDispatch } from "@redux/hooks"
import { 
  getAllMessages, 
  pushAllMessages 
} from "@services/supabase-actions"
import { 
  transformSupabaseThread, 
  transformSupabaseMessage 
} from "@types"
import { 
  useUser, 
  useSession, 
  useSnackbar 
} from "@hooks/global"
import { 
  // useInitialThread,
  useThreads,
  useSelectedThread,
  useMessageHistory
} from "@hooks/chat"
import { 
  createThread, 
  addMessage 
} from "@redux/slices/chat"
import { PageLayout } from "@ui/mui-layout"
import { Box } from "@mui/material"
import { 
  FlexBox, 
  // LoadingDialog 
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
  const messages = useMessageHistory()
  const selectedThread = useSelectedThread()
  const messageHistory = selectedThread ? selectedThread.messages : []

  useEffect(() => {
    if (!user?.id) return
    // Couldn't get this to work on page reload as an import
    const syncData = async () => {
      if (threads && threads.length > 0) {
        pushAllMessages(user.id, threads)
          .catch(() => showMessage("error", "Unable to save chats"))
      }
      const data = await getAllMessages(user.id)
      if (data.success) {
        if (data.chatThreads) {
          const chatThreads = data.chatThreads.map(transformSupabaseThread)
          for (const chatThread of chatThreads) {
            const threadExistsLocally = threads.some(thread => thread.id === chatThread.id)
            if (!threadExistsLocally) {
              dispatch(createThread(chatThread))

              if (data.chatMessages) {
                const chatMessages = data.chatMessages.map(transformSupabaseMessage)
                for (const chatMessage of chatMessages) {
                  const messageExistsLocally = messages.some(message => message.id === chatMessage.id)
                  if (!messageExistsLocally && chatMessage.threadId === chatThread.id) {
                    dispatch(addMessage({ threadId: chatThread.id, message: chatMessage }));
                  }
                }
              }
            }
          }
        }
      } else {
        showMessage("error", "Unable to fetch chats")
      }
    }
    syncData()
  }, [dispatch, user?.id])

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
