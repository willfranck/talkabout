import { 
  Flex, 
  Heading, 
  ScrollArea 
} from "@radix-ui/themes"
import { 
  SegmentedController, 
  ChatHistoryTabs
} from "@ui/radix-elements"
import { ChatTeardropText } from "@phosphor-icons/react/dist/ssr"


export const ChatPanel = () => {
  const chatItems = [
    {
      id: 1,
      title: "Build an application from scratch integrating AI",
      date: new Date(),
      active: false,
    },
    {
      id: 2,
      title: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 3,
      title: "How to bake a cake",
      date: new Date(),
      active: false,
    },
    {
      id: 4,
      title: "Build an application from scratch integrating AI",
      date: new Date(),
      active: false,
    },
    {
      id: 5,
      title: "Does my dog really love me?",
      date: new Date(),
      active: true,
    },
    {
      id: 6,
      title: "How to bake a cake",
      date: new Date(),
      active: false,
    },
    {
      id: 7,
      title: "Build an application from scratch integrating AI",
      date: new Date(),
      active: false,
    },
    {
      id: 8,
      title: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 9,
      title: "How to bake a cake",
      date: new Date(),
      active: false,
    },
    {
      id: 10,
      title: "Build an application from scratch integrating AI",
      date: new Date(),
      active: false,
    },
    {
      id: 11,
      title: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 12,
      title: "Does my dog really love me?",
      date: new Date(),
      active: false,
    },
    {
      id: 13,
      title: "Build an application from scratch integrating AI",
      date: new Date(),
      active: false,
    },
    {
      id: 14,
      title: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 15,
      title: "How to bake a cake",
      date: new Date(),
      active: false,
    },
  ]

  return (
    <aside className="flex flex-col items-center justify-start shrink-0 w-96 h-page-content gap-8 pt-8 pb-2 bg-gray-400/50 dark:bg-gray-950/30">
      <Flex direction="row" align="center" justify="between" width="100%" px="4">
        <Flex direction="row" align="center" gap="1">
          <ChatTeardropText size={24} weight="bold" />
          <Heading>Chats</Heading>
        </Flex>
        <SegmentedController values={["Active", "Archived"]} />
      </Flex>

      <ScrollArea type="scroll" scrollbars="vertical">
        <ChatHistoryTabs chat={chatItems} />
      </ScrollArea>
    </aside>  
  )
}
