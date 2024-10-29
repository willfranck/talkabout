"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography
} from "@mui/material"
import { 
  FlexBox, 
  Nav,
  MenuNav,
  ToolTip
} from "@ui/mui-elements"
import { MobileDrawer } from "@ui/mui-layout"
import { ChatPanel } from "@chat/chat-panel"
import { 
  House, 
  ChatTeardropText, 
  Info,
  SignIn
} from "@phosphor-icons/react/dist/ssr"
import theme from "@utils/mui-theme"


const links = [
  { name: "Home", path: "/", icon: <House size={24} weight="fill" /> },
  { name: "Chat", path: "/chat", icon: <ChatTeardropText size={24} weight="fill" /> },
  { name: "About", path: "/about", icon: <Info size={24} weight="fill" /> },
]

const Header = () => {
  const pathname = usePathname()
  const [drawerAnchorEl, setDrawerAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(drawerAnchorEl)

  const handleDrawerBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setDrawerAnchorEl(event.currentTarget)
  }
  const handleDrawerClose = () => {
    setDrawerAnchorEl(null)
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
          <Button 
            onClick={handleDrawerBtnClick}
            sx={{
              display: { xs: "flex", sm: "none" },
              visibility: (pathname === "/chat" ? "visible" : "hidden" )
            }}
          >
            <ChatTeardropText size={24} weight="bold" color={theme.palette.primary.light} />
          </Button>
          <MobileDrawer open={open} onClose={handleDrawerClose}>
            <ChatPanel />
          </MobileDrawer>
          
          <Link href={"/"}>
            <FlexBox sx={{ flexDirection: "column" }}>
              <Image 
                src="/images/Llama.webp" 
                alt="logo" 
                width={40} 
                height={40} 
                className="w-8 sm:w-10 h-auto rounded-logo invert dark:invert-0"
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

          <FlexBox sx={{ 
            display: { xs: "none", sm: "flex" }, 
            flexGrow: 1 
          }}>
            <Nav links={links}  />
          </FlexBox>

          <ToolTip title="Sign In" placement="bottom" arrow>
            <Link href={"/auth"} className="hidden sm:block">
              <Button 
                sx={{
                  "&:hover": {
                    color: "highlight.light"
                  }
                }}
              >
                <SignIn size={24} weight="bold" />
              </Button>
            </Link>
          </ToolTip>

          <MenuNav links={links} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
