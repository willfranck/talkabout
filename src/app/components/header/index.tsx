"use client"
import Link from "next/link"
import Image from "next/image"
import { 
  Container,
  AppBar,
  Toolbar,
} from "@mui/material"
import { FlexBox, Nav } from "@ui/mui-elements"
import { 
  House, 
  ChatTeardropText, 
  SignIn
} from "@phosphor-icons/react/dist/ssr"


const links = [
  { name: 'Home', path: '/', icon: <House size={24} weight="fill" /> },
  { name: 'Chat', path: '/chat', icon: <ChatTeardropText size={24} weight="fill" /> }
]

function ResponsiveAppBar() {
  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{
        boxShadow: "0px 2px 14px 4px rgba(0,0,0,0.36), 0px 4px 5px 4px rgba(0,0,0,0.24), 0px 1px 20px 1px rgba(0,0,0,0.12)"
      }}
    >
      <Container>
        <Toolbar disableGutters>
          <Link href={"/"}>
            <Image 
              src="/images/Llama.webp" 
              alt="logo" 
              width={40} 
              height={40} 
              className="w-10 h-10 rounded-logo invert dark:invert-0"
            />
          </Link>
          <FlexBox sx={{ flexGrow: 1 }}>
            <Nav links={links}  />
          </FlexBox>
          <FlexBox>
            <SignIn size={24} weight="bold" />
          </FlexBox>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
