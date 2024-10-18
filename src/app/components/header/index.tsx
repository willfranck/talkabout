// "use client"
// import Link from "next/link"
// import Image from "next/image"
// import { Flex } from "@radix-ui/themes"
// import { Nav } from "@ui/radix-elements"
// import { SignOut } from "@phosphor-icons/react/dist/ssr"

// export default function Header() {
//   const links = [
//     { name: "Home", path: "/" },
//     { name: "Chat", path: "/chat" },
//     // { name: "Login", path: "/login" },
//   ]

  
//   return (
//     <header className="flex items-center justify-between w-full h-16 px-4">
//       <Link href={"/"}>
//         <Image 
//           src="/images/Llama.webp" 
//           alt="logo" 
//           width={40} 
//           height={40} 
//           className="w-10 h-10 rounded-logo invert dark:invert-0"
//         />
//       </Link>

//       <Nav 
//         links={links.map(link => ({
//           ...link,
//           active: link.path === pathname
//         }))} 
//       />
      
//       <Flex 
//         align="center" 
//         justify="center" 
//         width="2.5rem" 
//         height="2.5rem"
//       >
//         <SignOut size={24} />
//       </Flex>
//     </header>
//   )
// }

"use client"
import { useState } from "react"
// import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  Container,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Tooltip
} from "@mui/material"
import { FlexBox, Nav } from "@ui/mui-elements"
import MenuIcon from "@mui/icons-material/Menu"
import { 
  House, 
  ChatTeardropText 
} from "@phosphor-icons/react/dist/ssr"

const links = [
  { name: 'Home', path: '/' },
  { name: 'Chat', path: '/chat' }
]
const settings = ['Profile', 'Logout'];


function ResponsiveAppBar() {
  // const pathname = usePathname()
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{
      boxShadow: "0px 2px 14px 4px rgba(0,0,0,0.36), 0px 4px 5px 4px rgba(0,0,0,0.24), 0px 1px 20px 1px rgba(0,0,0,0.12)"
    }}>
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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', justifyContent: "end" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {links.map((link) => (
                <Link href={link.path}>
                  <MenuItem key={link.name} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: 'center' }}>{link.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <FlexBox sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: "center" } }}>
            <Nav links={links} />
          </FlexBox>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} size="small" color="secondary" sx={{  p: 0 }}>
                <Avatar alt="Llamini Flash" src="none" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '1.8rem' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography component="p" sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;