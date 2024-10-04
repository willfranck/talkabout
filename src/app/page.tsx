import Image from "next/image"
import { ChatArea } from "@chat/chat-area"
import { ChatInput } from "@chat/chat-input"
import { SegmentedController } from "@ui/radix-elements"
import { ScrollArea, Flex } from "@radix-ui/themes"

export default function Home() {
  return (
    <main className="flex items-center justify-center gap-4 w-full h-[calc(100vh-4rem)] px-2 pb-2">
      <aside className="flex flex-col items-end justify-center w-60 h-full gap-8 p-4">
        <SegmentedController values={["Chats", "Settings"]} />
        <div className="flex flex-col text-end">
          <span>Build an application</span>
          <span>Ideas for new project</span>
          <span>How to bake a cake</span>
          <span>Does my dog really love me?</span>
        </div>
      </aside>

      <ScrollArea type="auto" scrollbars="vertical">
        <Flex direction="column" align="center" justify="center" gap="8" mt="8">
        <Image
          src={"/images/Llama.webp"}
          alt="Llama logo"
          width={128}
          height={128}
          className="w-32 h-auto rounded-full"
        />
        <ChatArea />
        <ChatInput />
        </Flex>
      </ScrollArea>
    </main>
  )
}
