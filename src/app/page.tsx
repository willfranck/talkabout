import { Flex } from "@radix-ui/themes"
import { PageLayout } from "@ui/radix-layout"
import { ChatPanel } from "@chat/chat-panel"
import { ChatArea } from "@chat/chat-area"
import { ChatInput } from "@chat/chat-input"


export default function Home() {
  return (
    <PageLayout>
      <ChatPanel />
      <Flex direction="column" gap="6" className="flex-1 h-page-content">
        <ChatArea />
        <ChatInput />
      </Flex>
    </PageLayout>
  )
}
