"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import theme from "@utils/mui-theme"
import { 
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@mui/material"
import { 
  FlexBox, 
  TabNav,
  MenuNav,
  ToolTip
} from "@ui/mui-elements"
import { MobileDrawer } from "@ui/mui-layout"
import { ChatPanel } from "@chat/chat-panel"
import { 
  House, 
  ChatTeardropText, 
  Info,
  SignIn,
  SquaresFour
} from "@phosphor-icons/react/dist/ssr"


const links = [
  { name: "Home", path: "/", icon: <House size={24} weight="fill" /> },
  { name: "Chat", path: "/chat", icon: <ChatTeardropText size={24} weight="fill" /> },
  { name: "About", path: "/about", icon: <Info size={24} weight="fill" /> },
]

const Header = () => {
  const pathname = usePathname()
  const [chatDrawerAnchorEl, setChatDrawerAnchorEl] = useState<HTMLElement | null>(null)
  const [navDrawerAnchorEl, setNavDrawerAnchorEl] = useState<HTMLElement | null>(null)
  const openChat = Boolean(chatDrawerAnchorEl)
  const openNav = Boolean(navDrawerAnchorEl)

  const handleChatDrawerBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setChatDrawerAnchorEl(event.currentTarget)
  }
  const handleNavDrawerBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setNavDrawerAnchorEl(event.currentTarget)
  }
  const handleChatDrawerClose = () => {
    setChatDrawerAnchorEl(null)
  }
  const handleNavDrawerClose = () => {
    setNavDrawerAnchorEl(null)
  }

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{
        boxShadow: "0px 2px 14px 4px rgba(0,0,0,0.36), 0px 4px 5px 4px rgba(0,0,0,0.24), 0px 1px 20px 1px rgba(0,0,0,0.12)"
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <FlexBox>
            <Link href={"/"}>
              <FlexBox sx={{ flexDirection: "column" }}>
                <Image 
                  src="/images/Llama.webp" 
                  alt="logo" 
                  width={40} 
                  height={40} 
                  className="w-7 sm:w-10 h-auto rounded-logo dark:invert"
                />
                <Typography 
                  variant="body2" 
                  color={theme.palette.secondary.contrastText} 
                  sx={{ 
                    display: { xs: "block", sm: "none" },
                    fontSize: "0.625rem" 
                  }}
                >
                  Talkabout
                </Typography>
              </FlexBox>
            </Link>
            <IconButton 
              size="medium"
              aria-label="Chat Menu Anchor"
              aria-haspopup="true"
              onClick={handleChatDrawerBtnClick}
              color="primary"
              sx={{
                display: { xs: "flex", md: "none" },
                visibility: (pathname === "/chat" ? "visible" : "hidden" )
              }}
            >
              <ChatTeardropText size={24} weight="bold" color={theme.palette.primary.light} />
            </IconButton>
            <MobileDrawer open={openChat} onClose={handleChatDrawerClose} anchor="left">
              <ChatPanel />
            </MobileDrawer>
          </FlexBox>

          <FlexBox sx={{ display: { xs: "none", sm: "flex" } }}>
            <TabNav links={links} />
          </FlexBox>

          <FlexBox sx={{ 
            justifyContent: "end",
            width: { xs: "2.5rem", sm: "5rem", md: "2.5rem" } 
          }}>
            <ToolTip title="Sign In" placement="bottom" arrow>
              <Link href={"/auth"} className="hidden sm:block">
                <IconButton
                  color="primary" 
                  sx={{
                    "&:hover": {
                      color: "highlight.light"
                    }
                  }}
                >
                  <SignIn size={24} weight="bold" />
                </IconButton>
              </Link>
            </ToolTip>
          </FlexBox>

          <IconButton
            size="medium"
            aria-label="Nav Menu Anchor"
            aria-haspopup="true"
            onClick={handleNavDrawerBtnClick}
            color="primary"
            sx={{
              display: { xs: "flex", sm: "none" },
              visibility: (pathname === "/chat" ? "visible" : "hidden" )
            }}
          >
            <SquaresFour size={24} color={theme.palette.primary.light} />
          </IconButton>
          <MobileDrawer open={openNav} onClose={handleNavDrawerClose} anchor="right">
            <MenuNav links={links} onClose={handleNavDrawerClose} />
          </MobileDrawer>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
