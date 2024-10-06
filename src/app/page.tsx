import { PageLayout } from "@ui/radix-layout"
// import Image from "next/image"
import { Flex } from "@radix-ui/themes"
import { ChatPanel } from "@chat/chat-history"
import { ChatArea } from "@chat/chat-area"
// import { ChatInput } from "@chat/chat-input"
// import { Dropdown } from "@ui/radix-elements"


export default function Home() {
  return (
    <PageLayout>
      <ChatPanel />

      {/* <Flex direction="column" align="center" justify="center" gap="8" flexGrow="1" mt="16" mr="8"> */}
        {/* <Image
          src={"/images/Llama.webp"}
          alt="Llama logo"
          width={128}
          height={128}
          className="invert dark:invert-0 w-32 h-auto rounded-full"
        />
        <Dropdown trigger="Open" /> */}
        <ChatArea />
        {/* <ChatInput /> */}
      {/* </Flex> */}
    </PageLayout>
  )
}
