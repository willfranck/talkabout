"use client"
import { useState } from "react"
import { 
  useAppSelector, 
  useAppDispatch 
} from "@redux/hooks"
import { 
  createNewThread, 
  displayTextByChar, 
  removeTextByChar 
} from "@globals/functions"
import { 
  Flex, 
  ScrollArea, 
  Text, 
  Button, 
  Heading, 
} from "@radix-ui/themes"
import { 
  SegmentedController, 
  ChatHistoryTabs
} from "@ui/radix-elements"
import { 
  ChatTeardropText, 
  PlusCircle 
} from "@phosphor-icons/react/dist/ssr"


export const ChatPanel = () => {
  const dispatch = useAppDispatch()
  const threads = useAppSelector((state) => state.chat.threads)
  const [displayedText, setDisplayedText] = useState("")

  return (
    <aside className="flex flex-col items-center justify-start shrink-0 w-96 h-page-content gap-4 pt-8 pb-2 bg-gray-400/50 dark:bg-gray-950/30">
      <Flex direction="row" align="center" justify="between" width="100%" px="4">
        <Flex direction="row" align="center" gap="1">
          <ChatTeardropText size={24} weight="bold" />
          <Heading>Chats</Heading>
        </Flex>
        <SegmentedController values={["Active", "Archived"]} />
      </Flex>

      <Button 
        variant="ghost" 
        onMouseEnter={() => displayTextByChar("New Thread", setDisplayedText)}
        onMouseLeave={() => removeTextByChar(displayedText, setDisplayedText)}
        onClick={() => createNewThread(dispatch)}
        className="group mt-2 mb-1"
      >
        <Text as="span">{displayedText}</Text>
        <PlusCircle size={24} />
      </Button>

      {threads.length === 0 && (
        <Text 
          as="span" 
          className="opacity-0 fade-in mt-1.5" 
          style={{ animationDelay: "360ms" }}
        >
          Create a New Thread to Chat
        </Text>
      )}

      <ScrollArea type="scroll" scrollbars="vertical">
        <ChatHistoryTabs threads={threads} />
      </ScrollArea>
    </aside>  
  )
}
