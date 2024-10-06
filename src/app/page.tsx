import { Flex } from "@radix-ui/themes"
import { PageLayout } from "@ui/radix-layout"
import { ChatPanel } from "@chat/chat-history"
import { ChatArea } from "@chat/chat-area"
import { ChatInput } from "@chat/chat-input"


export default function Home() {
  return (
    <PageLayout>
      <ChatPanel />
      <Flex direction="column" gap="4" className="h-page-content">
        <ChatArea />
        <ChatInput />
      </Flex>
    </PageLayout>
  )
}
