"use client"
import { useState, useEffect, useRef } from "react"
import { ChatThread } from "@types"
import { saveThread } from "@services/supabase-actions"
import { threadCategories } from "@globals/values"
import { useAppDispatch } from "@redux/hooks"
import { useUser, useIsMobileOS } from "@hooks/global"
import theme from "@utils/mui-theme"
import { 
  createNewThread, 
  selectThread, 
  displayTextByChar, 
  removeTextByChar 
} from "@globals/functions"
import { 
  useThreads,
  useActiveThreads,
  useLastActiveThread,
  useSelectedThread,
  useArchivedThreads
} from "@hooks/chat"
import {
  alpha,
  Box,
  Button,
  Typography,
  Alert
} from "@mui/material"
import { 
  FlexBox, 
  ToggleGroup
} from "@ui/mui-elements"
import { 
  ChatHistoryTabs 
} from "@ui/chat-elements"
import { 
  ChatTeardropText, 
  PlusCircle, 
  Info
} from "@phosphor-icons/react/dist/ssr"


export const ChatPanel = () => {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const isMobileOS = useIsMobileOS()
  const threads = useThreads()
  const activeThreads = useActiveThreads()
  const lastActiveThread = useLastActiveThread()
  const selectedThread = useSelectedThread()
  const archivedThreads = useArchivedThreads()
  const archiveRef = useRef(archivedThreads.length)
  const [activeThreadCategory, setActiveThreadCategory] = useState(threadCategories[0]) 
  const [displayedText, setDisplayedText] = useState("")
  const sortedThreads = (threads: ChatThread[]) => {
    return threads
      .filter(thread => thread.category === activeThreadCategory)
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  }

  useEffect(() => {
    if (activeThreads && activeThreads.length === 1) {
      const remainingThread = activeThreads[0].id
      selectThread(dispatch, remainingThread)
    }
  }, [dispatch, activeThreads])

  useEffect(() => {
    if (!selectedThread && lastActiveThread) {
      selectThread(dispatch, lastActiveThread)
    }
  }, [dispatch, selectedThread, activeThreads, lastActiveThread])

  useEffect(() => {
    const currentlyArchived = archivedThreads.length
    if (archivedThreads.length === 0 && currentlyArchived !== archiveRef.current) {
      setActiveThreadCategory("active")
    }
    archiveRef.current = currentlyArchived
  }, [archivedThreads, archiveRef])

  const handleNewThreadClick = () => {
    createNewThread(dispatch)
    setActiveThreadCategory("active")
    if (user && selectedThread) {
      saveThread(user.id, selectedThread)
    }
  }

  return (
    <FlexBox sx={{
      flexDirection: "column",
      justifyContent: "start",
      flexShrink: "0",
      gap: "1rem",
      width: { xs: "21rem", sm: "22rem", md: "23rem", lg: "25rem" },
      height: "100%",
      paddingTop: "2rem",
      paddingBottom: "1rem",
      backgroundColor: alpha(theme.palette.primary.dark, 0.08)
    }}>
      <FlexBox sx={{
        justifyContent: "space-between",
        gap: "1rem",
        width: "100%",
        paddingX: "1rem"
      }}>
        <FlexBox sx={{
          alignSelf: "start",
          gap: "0.25rem"
        }}>
          <ChatTeardropText size={24} weight="bold" />
          <Typography variant="h5" fontWeight="700">Chats</Typography>
        </FlexBox>
        <ToggleGroup 
          values={threadCategories} 
          activeTab={activeThreadCategory}
          onClick={(value) => setActiveThreadCategory(value)} 
        />
      </FlexBox>

      <Button 
        onMouseEnter={() => !isMobileOS && displayTextByChar("New Thread ", setDisplayedText)}
        onMouseLeave={() => !isMobileOS && removeTextByChar(displayedText, setDisplayedText)}
        onClick={handleNewThreadClick}
        aria-label="Create new chat thread"
      >
        <PlusCircle size={24} className="mr-1" />
        <Typography variant="body2" color="primary.main">
          {isMobileOS ? "New Thread " : displayedText}
        </Typography>
      </Button>
        
      {activeThreads.length === 0 && activeThreadCategory === "active" && (
        <Alert 
          icon={<Info />} 
          severity="info"
          sx={{ 
            opacity: 0, 
            animation: "fadeInFromBottom 240ms ease-out 360ms forwards" 
          }} 
        >
          Create a New Thread to Chat
        </Alert>
      )}

      <Box sx={{
        width: "100%",
        overflowY: "scroll",
      }}>
        <ChatHistoryTabs threads={sortedThreads(threads)} />
      </Box>
    </FlexBox>
  )
}
