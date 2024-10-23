import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AppDispatch } from "@redux/store"
import { useAppDispatch } from "@redux/hooks"
import theme from "@utils/mui-theme"
import {
  alpha,
  Box,
  BoxProps,
  Button,
  IconButton,
  Tabs,
  Tab,
  Popover,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  TooltipProps,
  tooltipClasses
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { 
  DotsThreeVertical,
  SignIn,
  Trash, 
  ArrowDown, 
  Archive,
  ArrowCounterClockwise
} from "@phosphor-icons/react/dist/ssr"
import { useIsMobileOS } from "@hooks/global"


const FlexBox = styled(Box)<BoxProps>(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}))

const ToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: alpha(theme.palette.info.dark, 0.4),
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: alpha(theme.palette.info.dark, 0.4),
    backdropFilter: "blur(20px)",
    textAlign: "center",
    padding: "0.5rem",
  },
}))

interface INav {
  name: string
  path: string
  icon: React.ReactNode
}

const Nav = ({
  links
}: {
  links: INav[]
}) => {
  const pathname = usePathname()
  const currentPath = links.findIndex(link => link.path === pathname)
  const [tabIndex, setTabIndex] = useState(currentPath)

  useEffect(() => {
    setTabIndex(currentPath)
  }, [currentPath])

  const linkElements = links.map((link) => (
    <ToolTip key={link.name} title={link.name} placement="bottom" arrow>
      <Link href={link.path} className="outline-none">
        <Tab 
          label={link.icon}
          sx={{ 
            color: (link.path === pathname ? "highlight.main" : "primary.main"),
            "&:hover": { 
              color: (link.path !== pathname ? "highlight.light" : "")
            }
          }}
        />
      </Link>
    </ToolTip>
  ))
  
  return (
    <Tabs value={tabIndex}>
      {linkElements}
    </Tabs>
  )
}

const MenuNav = ({
  links
}: {
  links: INav[]
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(menuAnchorEl)

  const handleMenuBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const linkElements = links.map((link) => (
    <Link key={link.name} href={link.path}>
      <ListItemButton onClick={handleMenuClose} sx={{ height: "2.5rem", marginLeft: "0.25rem" }}>
        <ListItemIcon sx={{ minWidth: "2.25rem" }}>
          {link.icon}
        </ListItemIcon>
        <ListItemText primary={link.name} />
      </ListItemButton>
    </Link>
  ))

  return (
    <Box sx={{ 
      display: {xs: "block", sm: "none" }
    }}>
      <IconButton
        size="medium"
        aria-label="Menu Anchor"
        aria-controls="appbar-menu"
        aria-haspopup="true"
        onClick={handleMenuBtnClick}
        color="primary"
      >
        <DotsThreeVertical size={24} weight="bold" color={theme.palette.primary.light} />
      </IconButton>
      <Popover 
        open={open}
        onClose={handleMenuClose}
        elevation={1}
        anchorEl={menuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <FlexBox 
          sx={{ 
            alignItems: "start",
            width: "calc(100vw - 2rem)",
            paddingY: "0.5rem"
          }}
        >
          <List sx={{
            flexDirection: "column",
            alignItems: "start",
            width: "50%",
            paddingY: "0"
          }}>
            <ListSubheader sx={{
              width: "100%",
              lineHeight: "2rem",
              color: "primary.dark"
            }}>
              Navigation
            </ListSubheader>
            {linkElements}
          </List>
          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{
              borderColor: "primary.dark"
            }}
          />
          <List sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "50%",
            paddingY: "0"
          }}>
            <ListSubheader sx={{
              width: "100%",
              lineHeight: "2rem",
              color: "primary.dark"
            }}>
              Account
            </ListSubheader>
            <ListItemButton onClick={handleMenuClose} sx={{ height: "2.5rem", marginLeft: "0.25rem" }}>
              <ListItemIcon sx={{ minWidth: "2rem" }}>
                <SignIn size={24} weight="bold" color={theme.palette.primary.main} /> 
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItemButton>
          </List>
        </FlexBox>
      </Popover>
    </Box>
  )
}

interface IToggleGroup {
  values: string[]
  activeTab: string
  onClick: (value: string) => void
}

const ToggleGroup = ({
  values, 
  activeTab,
  onClick
}: IToggleGroup) => {
  const toggleButtons = values.map((value) => (
    <ToggleButton sx={{
      width: "5rem",
      textTransform: "capitalize",
    }}
      key={value} 
      value={value}
      onClick={() => onClick(value)}
    >
      {value}
    </ToggleButton>
  ))

  return (
    <ToggleButtonGroup sx={{
      height: "2rem",
    }}
      size="small"
      value={activeTab}
    >
      {toggleButtons}
    </ToggleButtonGroup>
  )
}

interface IDeleteButton {
  action: (dispatch: AppDispatch, id: string) => void
  itemId: string
  location: "threads" | "chat-history",
}

const DeleteButton = ({
  action,
  itemId,
  location
}: IDeleteButton) => {
  const dispatch = useAppDispatch()
  const isMobileOS = useIsMobileOS()

  return (
    <Button 
      onClick={() => action(dispatch, itemId)}
      tabIndex={-1}
      className="actionButton"
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
        zIndex: "10",
        flexDirection: "row",
        gap: "0.25rem",
        width: "2.5rem",
        height: "100%",
        borderRadius: "0",
        color: "secondary.contrastText",
        bgcolor: alpha(theme.palette.error.dark, 0.9),
        "&:hover": {
          bgcolor: alpha(theme.palette.error.main, 0.9),
        }
      }} 
    >
      <Trash size={23} color="currentColor" />
      {location === "chat-history" && (
        <ArrowDown size={20} />
      )}
    </Button>
  )
}

interface IArchiveButton {
  action: (dispatch: AppDispatch, id: string) => void
  itemId: string
  location: "active" | "archived"
}

const ArchiveButton = ({
  action,
  itemId,
  location
}: IArchiveButton) => {
  const dispatch = useAppDispatch()
  const isMobileOS = useIsMobileOS()

  return (
    <Button 
      onClick={() => action(dispatch, itemId)}
      tabIndex={-1}
      className="actionButton"
      sx={{
        position: "absolute",
        top: "0",
        right: "2.5rem",
        zIndex: "10",
        flexDirection: "column",
        gap: "0.25rem",
        width: "2.5rem",
        height: "100%",
        borderRadius: "0",
        color: "secondary.contrastText",
        bgcolor: alpha(theme.palette.info.main, 0.9),
        "&:hover": {
          bgcolor: alpha(theme.palette.info.light, 0.9),
        }
      }} 
    >
      {location === "active" && (
        <Archive size={23} color="currentColor" />
      )}
      {location === "archived" && (
        <ArrowCounterClockwise size={22} color="currentColor" />
      )}
    </Button>
  )
}


export {
  FlexBox,
  ToolTip,
  Nav,
  MenuNav,
  ToggleGroup,
  ArchiveButton,
  DeleteButton,
}