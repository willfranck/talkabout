import { ScrollArea } from "@radix-ui/themes"
import { 
  SegmentedController, 
  ChatHistory
} from "@ui/radix-elements"


export const ChatPanel = () => {
  const chatItems = [
    {
      id: 1,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
    },
    {
      id: 2,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
    },
    {
      id: 3,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
    },
    {
      id: 4,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
    },
    {
      id: 5,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
    },
    {
      id: 6,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
    },
    {
      id: 7,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
    },
    {
      id: 8,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
    },
    {
      id: 9,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
    },
    {
      id: 10,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
    },
    {
      id: 11,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
    },
    {
      id: 12,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
    },
    {
      id: 13,
      title: "Build an application from scratch integrating AI",
      description: "Ideas for new project",
      date: new Date(),
    },
    {
      id: 14,
      title: "Ideas for new project",
      description: "Build an application",
      date: new Date(),
    },
    {
      id: 15,
      title: "How to bake a cake",
      description: "Does my dog really love me?",
      date: new Date(),
    },
  ]

  return (
    <aside className="flex flex-col items-center justify-start w-96 h-[calc(100vh-4rem)] gap-8 py-8 bg-gray-400 dark:bg-gray-950">
      <SegmentedController values={["Active", "Archived"]} />
      <ScrollArea type="hover" scrollbars="vertical">
        <ChatHistory chat={chatItems} />
      </ScrollArea>
    </aside>  
  )
}
