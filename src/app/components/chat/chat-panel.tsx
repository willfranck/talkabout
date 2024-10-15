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
  Button, 
  Callout, 
  Heading, 
} from "@radix-ui/themes"
import { SegmentedController } from "@ui/radix-elements"
import { ChatHistoryTabs } from "@ui/chat-elements"
import { 
  ChatTeardropText, 
  PlusCircle, 
  Info
} from "@phosphor-icons/react/dist/ssr"
import { threadCategories } from "@globals/values"


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
    <aside className="flex flex-col items-center justify-start shrink-0 w-96 h-page-content gap-4 pt-8 pb-2 bg-gray-400/50 dark:bg-gray-950/30">
      <Flex direction="row" align="center" justify="between" width="100%" px="4">
        <Flex direction="row" align="center" gap="1">
          <ChatTeardropText size={24} weight="bold" />
          <Heading>Chats</Heading>
        </Flex>
        <SegmentedController 
          values={threadCategories} 
          activeTab={activeThreadCategory}
          onClick={(value) => setActiveThreadCategory(value)} 
        />
      </Flex>

      <Button 
        variant="ghost" 
        onMouseEnter={() => displayTextByChar("New Thread", setDisplayedText)}
        onMouseLeave={() => removeTextByChar(displayedText, setDisplayedText)}
        onClick={() => {createNewThread(dispatch), setActiveThreadCategory("active")}}
        className="group mt-2 mb-1"
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

      <ScrollArea type="scroll" scrollbars="vertical">
        <ChatHistoryTabs threads={sortedThreads(threads)} />
      </ScrollArea>
    </aside>  
  )
}
