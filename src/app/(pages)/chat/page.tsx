"use client"
import { useState } from "react"
import theme from "@utils/mui-theme"
import { 
  alpha, 
  Box, 
  Fab 
} from "@mui/material"
import { 
  PageLayout, 
  MobileDrawer 
} from "@ui/mui-layout"
import { ChatPanel } from "@chat/chat-panel"
import { ChatArea } from "@chat/chat-area"
import { ChatTeardropText } from "@phosphor-icons/react/dist/ssr"


export default function ChatPage() {
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
      <ChatArea /> 
      <Fab 
        size="small" 
        onClick={handleDrawerBtnClick}
        sx={{
          position: "absolute",
          bottom: "10.25rem",
          left: { xs: "0.825rem", sm: "0.625rem"},
          display: { xs: "flex", md: "none" },
          backgroundColor: alpha(theme.palette.primary.main, 0.33)
        }}
      >
        <ChatTeardropText size={24} weight="fill" color={theme.palette.primary.light} />
      </Fab>
    </PageLayout>
  )
}
