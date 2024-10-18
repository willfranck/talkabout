"use client"
import { useState, useEffect } from "react"
import { ChatThread } from "@types"
import { useAppDispatch } from "@redux/hooks"
import { 
  createNewThread, 
  selectActiveThread, 
  displayTextByChar, 
  removeTextByChar 
} from "@globals/functions"
import { 
  useInitialThread, 
  useThreads 
} from "@hooks/chat"
import { 
  Flex, 
  ScrollArea, 
  Text, 
  Callout, 
  Heading, 
} from "@radix-ui/themes"
import {
  Box,
  Button,
  Typography,
} from "@mui/material"
import { FlexBox } from "@ui/mui-elements"
import { ChatHistoryTabs } from "@ui/chat-elements"
import { 
  ChatTeardropText, 
  PlusCircle, 
  Info
} from "@phosphor-icons/react/dist/ssr"
import { threadCategories } from "@globals/values"
import { ToggleGroup } from "@ui/mui-elements"


export const ChatPanel = () => {
  const dispatch = useAppDispatch()
  const [activeThreadCategory, setActiveThreadCategory] = useState(threadCategories[0]) 
  const [displayedText, setDisplayedText] = useState("")
  
  const threads = useThreads()
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
        paddingBottom: "1rem"
      }} 
      className="bg-gray-400/50 dark:bg-gray-950/30"
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
        onMouseEnter={() => displayTextByChar("New Thread", setDisplayedText)}
        onMouseLeave={() => removeTextByChar(displayedText, setDisplayedText)}
        onClick={() => {createNewThread(dispatch), setActiveThreadCategory("active")}}
        className="group"
      >
        <Text as="span">{displayedText}</Text>
        <PlusCircle size={24} />
      </Button>

      {threads.length === 0 && (
        <Callout.Root
          variant="soft"
          size="1"
          color="sky"
          className="opacity-0 fade-in"
          style={{ animationDelay: "360ms" }}
        >
          <Callout.Icon>
            <Info size={18} />
          </Callout.Icon>
          <Callout.Text>
            Create a New Thread to Chat
          </Callout.Text>
        </Callout.Root>
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
