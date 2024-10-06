import { 
  Flex, 
  Heading, 
  ScrollArea 
} from "@radix-ui/themes"
import { 
  SegmentedController, 
  ChatHistory
} from "@ui/radix-elements"
import { ChatTeardropText } from "@phosphor-icons/react/dist/ssr"


export const ChatPanel = () => {
  const chatItems = [
    {
      id: 1,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 2,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
      active: false,
    },
    {
      id: 3,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
      active: false,
    },
    {
      id: 4,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 5,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
      active: true,
    },
    {
      id: 6,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
      active: false,
    },
    {
      id: 7,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 8,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
      active: false,
    },
    {
      id: 9,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
      active: false,
    },
    {
      id: 10,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 11,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
      active: false,
    },
    {
      id: 12,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
      active: false,
    },
    {
      id: 13,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
      active: false,
    },
    {
      id: 14,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
      active: false,
    },
    {
      id: 15,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
      active: false,
    },
  ]

  return (
    <aside className="flex flex-col items-center justify-start w-96 h-[calc(100vh-4rem)] gap-8 pt-8 pb-2 px-4 bg-gray-400 dark:bg-gray-950">
      <Flex direction="row" align="center" justify="between" width="100%">
        <Flex direction="row" align="center" gap="1">
          <ChatTeardropText size={24} weight="bold" />
          <Heading>Chats</Heading>
        </Flex>
        <SegmentedController values={["Active", "Archived"]} />
      </Flex>
      <ScrollArea type="hover" scrollbars="vertical">
        <ChatHistory chat={chatItems} />
      </ScrollArea>
    </aside>  
  )
}
