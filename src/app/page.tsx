import { PageLayout } from "@ui/radix-layout"
import { ChatPanel } from "@chat/chat-history"
import { ChatArea } from "@chat/chat-area"
// import { ChatInput } from "@chat/chat-input"


export default function Home() {
  return (
    <PageLayout>
      <ChatPanel />
      <ChatArea />
      {/* <ChatInput /> */}
    </PageLayout>
  )
}
