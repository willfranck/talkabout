"use client"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createNewThread } from "@globals/functions"
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
import { ChatTeardropText, PlusCircle } from "@phosphor-icons/react/dist/ssr"


export const ChatPanel = () => {
  const dispatch = useAppDispatch()
  const threads = useAppSelector((state) => state.chat.threads)


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
        onClick={() => createNewThread(dispatch)}
        className="group w-32 mt-2 mb-1"
      >
        <Text as="span" className="hidden group-hover:block fade-in">New Thread</Text>
        <PlusCircle size={24} />
      </Button>

      <ScrollArea type="scroll" scrollbars="vertical">
        <ChatHistoryTabs threads={threads} />
      </ScrollArea>
    </aside>  
  )
}
