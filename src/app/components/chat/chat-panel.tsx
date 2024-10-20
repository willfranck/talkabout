"use client"
import { useState, useEffect } from "react"
import { ChatThread } from "@types"
import { threadCategories } from "@globals/values"
import { useAppDispatch } from "@redux/hooks"
import theme from "@utils/mui-theme"
import { 
  createNewThread, 
  selectActiveThread, 
  displayTextByChar, 
  removeTextByChar 
} from "@globals/functions"
import { 
  useInitialThread, 
  useThreads ,
  useActiveThreads
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
  const [activeThreadCategory, setActiveThreadCategory] = useState(threadCategories[0]) 
  const [displayedText, setDisplayedText] = useState("")
  
  const threads = useThreads()
  const activeThreads = useActiveThreads()
  const sortedThreads = (threads: ChatThread[]) => {
    return threads
      .filter(thread => thread.category === activeThreadCategory)
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  }

  useInitialThread()

  useEffect(() => {
    if (threads && threads.length === 1) {
      const remainingThread = threads[0].id
      selectActiveThread(dispatch, remainingThread)
    }
  }, [dispatch, threads])

  useEffect(() => {
    console.log(activeThreads.length)
  })

  return (
    <FlexBox as="aside"
      sx={{
        flexDirection: "column",
        justifyContent: "start",
        flexShrink: "0",
        gap: "1rem",
        width: "24rem",
        height: "100%",
        paddingTop: "2rem",
        paddingBottom: "1rem",
        backgroundColor: alpha(theme.palette.primary.dark, 0.08)
      }} 
    >
      <FlexBox sx={{
        justifyContent: "space-between",
        width: "100%",
        paddingX: "1rem"
      }}>
        <FlexBox sx={{
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
        onMouseEnter={() => displayTextByChar("New Thread ", setDisplayedText)}
        onMouseLeave={() => removeTextByChar(displayedText, setDisplayedText)}
        onClick={() => {createNewThread(dispatch), setActiveThreadCategory("active")}}
      >
        <Typography 
          variant="body2"
          color="primary.main"
        >
          {displayedText}
        </Typography>
        <PlusCircle size={24} weight="bold" />
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
