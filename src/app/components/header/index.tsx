"use client"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession, useSnackbar } from "@hooks/global"
import { signOut } from "@services/supabase-actions"
import { useAppDispatch } from "@redux/hooks"
import { clearUser } from "@redux/slices/user"
import { clearAllThreads } from "@redux/slices/chat"
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
  SignOut,
  UserCircleGear,
  SquaresFour,
  CaretLeft
} from "@phosphor-icons/react/dist/ssr"


const links = [
  { name: "Home", path: "/", icon: <House size={24} /> },
  { name: "Chat", path: "/chat", icon: <ChatTeardropText size={24} /> },
  { name: "About", path: "/about", icon: <Info size={24} /> },
]

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { session } = useSession()
  const dispatch = useAppDispatch()
  const { showMessage } = useSnackbar()
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

  const handleSignOut = async () => {
    const res = await signOut()
    if (res.error) {
      showMessage("error", res.message || "Undefined error signing out")
    } else {
      showMessage("success", "Signed out.  See you soon!")
      dispatch(clearUser())
      dispatch(clearAllThreads())
      if (pathname === "/profile") {
        router.push("/")
      }
    }
  }

  const llamaLogo = (
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
  )

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
            <FlexBox sx={{ display: { xs: "none", sm: "flex" } }}>
              {llamaLogo}
            </FlexBox>
            <ToolTip title="Chats" placement="bottom" arrow>
              <IconButton 
                aria-label="Open chat menu"
                aria-haspopup="true"
                onClick={handleChatDrawerBtnClick}
                color="primary"
                sx={{
                  display: { xs: "flex", md: "none" },
                  visibility: (pathname === "/chat" ? "visible" : "hidden" ),
                  width: "2.5rem",
                  "&:hover": {
                    color: "highlight.light"
                  }
                }}
              >
                <CaretLeft size={12} weight="fill" />
                <ChatTeardropText size={24} className="-translate-x-1" />
              </IconButton>
            </ToolTip>
            <MobileDrawer open={openChat} onClose={handleChatDrawerClose} anchor="left">
              <ChatPanel />
            </MobileDrawer>
          </FlexBox>

          <FlexBox sx={{ display: { xs: "flex", sm: "none" } }}>
            {llamaLogo}
          </FlexBox>

          <FlexBox sx={{ display: { xs: "none", sm: "flex" } }}>
            <TabNav links={links} />
          </FlexBox>

          <FlexBox sx={{ 
            justifyContent: "end",
            display: { xs: "none", sm: "flex" },
            width: { sm: "5rem", md: "2.5rem" } 
          }}>
            {session ? (
              <>
                <ToolTip title="Profile" placement="bottom" arrow>
                  <IconButton
                    LinkComponent={Link}
                    href="/profile"
                    aria-label="Profile"
                    color="primary"
                    sx={{
                      "&:hover": {
                        color: "highlight.light"
                      }
                    }}
                  >
                    <UserCircleGear size={24} />
                  </IconButton>
                </ToolTip>
                <ToolTip title="Sign Out" placement="bottom" arrow>
                  <IconButton
                    color="primary"
                    onClick={handleSignOut} 
                    aria-label="Sign Out"
                    sx={{
                      "&:hover": {
                        color: "highlight.light"
                      }
                    }}
                  >
                    <SignOut size={24} />
                  </IconButton>
                </ToolTip>
              </>
            ) : (
              <ToolTip title="Sign In" placement="bottom" arrow>
                <IconButton
                  LinkComponent={Link}
                  href="/auth"
                  color="primary" 
                  aria-label="Sign In"
                  sx={{
                    "&:hover": {
                      color: "highlight.light"
                    }
                  }}
                >
                  <SignIn size={24} />
                </IconButton>
              </ToolTip>
            )}
          </FlexBox>

          <IconButton
            size="medium"
            aria-label="Open navigation menu"
            aria-haspopup="true"
            onClick={handleNavDrawerBtnClick}
            color="primary"
            sx={{
              display: { xs: "flex", sm: "none" },
            }}
          >
            <SquaresFour size={24} weight="light" color={theme.palette.primary.light} />
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
