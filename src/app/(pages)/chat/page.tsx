"use client"
import { useState } from "react"
import { useSelectedThread } from "@hooks/chat"
import { 
  Box 
} from "@mui/material"
import { 
  PageLayout, 
  MobileDrawer 
} from "@ui/mui-layout"
import { FlexBox } from "@ui/mui-elements"
import { ChatPanel } from "@chat/chat-panel"
import { ChatHistory } from "@ui/chat-elements"
import { ChatInput } from "@chat/chat-input"


export default function ChatPage() {
  const selectedThread = useSelectedThread()
  const messageHistory = selectedThread ? selectedThread.messages : []
  const [drawerAnchorEl, setDrawerAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(drawerAnchorEl)

  const handleDrawerBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setDrawerAnchorEl(event.currentTarget)
  }
  const handleDrawerClose = () => {
    setDrawerAnchorEl(null)
  }

  return (
    <PageLayout>
      <MobileDrawer open={open} onClose={handleDrawerClose}>
        <ChatPanel />
      </MobileDrawer>
      <Box 
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%"
        }}
      >
        <ChatPanel />
      </Box>
      <FlexBox sx={{
        flexDirection: "column",
        flexGrow: "1",
        height: "100%",
        gap: "1rem",
        padding: { xs: "0", sm: "0 1rem 0.75rem", lg: "0 2rem 1rem 0" }
      }}>
        <ChatHistory messages={messageHistory} />
        <ChatInput onButtonClick={handleDrawerBtnClick} />
      </FlexBox>
    </PageLayout>
  )
}
