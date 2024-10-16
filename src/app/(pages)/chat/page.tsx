import { PageLayout } from "@ui/radix-layout"
import { ChatPanel } from "@chat/chat-panel"
import { ChatArea } from "@chat/chat-area"


export default function ChatPage() {
  return (
    <PageLayout>
      <ChatPanel />
      <ChatArea />
    </PageLayout>
  )
}
