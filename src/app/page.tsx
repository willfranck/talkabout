import { PageLayout } from "@ui/radix-layout"
import Image from "next/image"
import { ChatHistory } from "@chat/chat-history"
import { ChatArea } from "@chat/chat-area"
import { ChatInput } from "@chat/chat-input"
import { Flex } from "@radix-ui/themes"

export default function Home() {
  return (
    <PageLayout>
      <ChatHistory />

      {/* <ScrollArea type="auto" scrollbars="vertical"> */}
        <Flex direction="column" align="center" justify="center" gap="8" mt="8">
          <Image
            src={"/images/Llama.webp"}
            alt="Llama logo"
            width={128}
            height={128}
            className="invert dark:invert-0 w-32 h-auto rounded-full"
          />
          <ChatArea />
          <ChatInput />
        </Flex>
      {/* </ScrollArea> */}
    </PageLayout>
  )
}
