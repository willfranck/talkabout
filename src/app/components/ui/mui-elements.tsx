import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AppDispatch } from "@redux/store"
import { useAppDispatch } from "@redux/hooks"
import { clearUser } from "@redux/slices/user"
import { clearChats } from "@redux/slices/chat"
import { signOut } from "@services/supabase-actions"
import { 
  useSession, 
  useIsMobileOS, 
  useSnackbar, 
  useUser
} from "@hooks/global"
import { 
  ChatThread, 
  ChatMessage, 
  SupabaseRes, 
  UpdateableThreadColumns 
} from "@types"
import { styled } from "@mui/material/styles"
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
  tooltipClasses,
  Dialog,
  Typography
} from "@mui/material"
import { 
  SignIn,
  SignOut,
  UserCircleGear,
  Trash, 
  ArrowDown, 
  Archive,
  ArrowCounterClockwise,
  SpinnerGap
} from "@phosphor-icons/react/dist/ssr"


const FlexBox = styled(Box)<BoxProps>(({}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}))

const ToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: alpha(theme.palette.info.dark, 0.3),
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: alpha(theme.palette.info.dark, 0.3),
    backdropFilter: "blur(5px)",
    textAlign: "center",
    padding: "0.5rem",
  },
}))

interface INav {
  name: string
  path: string
  icon: React.ReactElement
}

const TabNav = ({
  links
}: {
  links: INav[]
}) => {
  const pathname = usePathname()
  const currentPath = links.findIndex(link => link.path === pathname)
  const [tabValue, setTabValue] = useState(currentPath)

  useEffect(() => {
    setTabValue(currentPath)
  }, [currentPath])

  const linkElements = links.map((link) => (
    <ToolTip key={link.name} title={link.name} placement="bottom" arrow>
      <Tab 
        LinkComponent={Link}
        href={link.path}
        icon={link.icon}
        role="tab"
        aria-label={link.name}
        sx={{ 
          color: "primary.main",
          "&:hover": { 
            color: (link.path !== pathname ? "highlight.light" : "")
          }
        }}
      />
    </ToolTip>
  ))
  
  return (
    <Tabs value={tabValue >= 0 ? tabValue : false} aria-label="Page navigation">
      {linkElements}
    </Tabs>
  )
}

const MenuNav = ({
  links,
  onClose
}: {
  links: INav[]
  onClose: () => void
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const { session } = useSession()
  const dispatch = useAppDispatch()
  const { showMessage } = useSnackbar()

  const handleSignOut = async () => {
    const res = await signOut()
    if (res.error) {
      onClose()
      showMessage("error", res.message || "Undefined error signing out", 3000)
    } else {
      onClose()
      showMessage("success", "Signed out.  See you soon!", 3000)
      dispatch(clearUser())
      dispatch(clearChats())
      if (pathname === "/profile") {
        router.push("/")
      }
    }
  }

  const linkElements = links.map((link) => (
    <ListItemButton
      key={link.name} 
      LinkComponent={Link} 
      href={link.path} 
      onClick={onClose} 
      role="button" 
      aria-label={link.name} 
      sx={{ 
        height: "2.5rem", 
        margin: "0 0 0.25rem 0.25rem" 
      }}
    >
      <ListItemIcon sx={{ minWidth: "1.875rem" }}>
        {link.icon}
      </ListItemIcon>
      <ListItemText primary={link.name} />
    </ListItemButton>
  ))

  return (
    <FlexBox 
      sx={{ 
        position: "relative",
        flexDirection: "column",
        justifyContent: "start",
        width: "100%",
        height: "100%",
        gap: "0.5rem",
        padding: "0.5rem 0 0.25rem 0.75rem"
      }}
      className="before:absolute before:inset-0 before:content-[''] before:bg-llama-banner before:bg-cover before:opacity-[0.025]"
    >
      <List sx={{
        width: "100%",
        paddingY: "0.25rem"
      }}>
        <ListSubheader sx={{
          width: "100%",
          lineHeight: "2rem",
          color: "primary.dark",
          background: "transparent"
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
        width: "100%",
        paddingY: "0.25rem"
      }}>
        <ListSubheader sx={{
          width: "100%",
          lineHeight: "2rem",
          color: "primary.dark",
          background: "transparent"
        }}>
          Account
        </ListSubheader>
        {session ? (
          <>
            <ListItemButton 
              LinkComponent={Link} 
              href="/profile"
              onClick={onClose}
              role="button"
              aria-label="Profile" 
              sx={{ 
                height: "2.5rem", 
                margin: "0 0 0.25rem 0.25rem" 
              }}
            >
              <ListItemIcon sx={{ minWidth: "1.875rem" }}>
                <UserCircleGear size={24} color={theme.palette.primary.light} /> 
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton 
              onClick={handleSignOut} 
              role="button"
              aria-label="Sign Out"
              sx={{ 
                height: "2.5rem", 
                margin: "0 0 0.25rem 0.25rem" 
              }}
            >
              <ListItemIcon sx={{ minWidth: "1.875rem" }}>
                <SignOut size={24} color={theme.palette.primary.light} className="translate-x-px" /> 
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton 
            LinkComponent={Link} 
            href="/auth" 
            onClick={onClose} 
            role="button"
            aria-label="Sign In"
            sx={{ 
              height: "2.5rem", 
              marginLeft: "0.25rem" 
            }}
          >
            <ListItemIcon sx={{ minWidth: "1.875rem" }}>
              <SignIn size={24} color={theme.palette.primary.light} /> 
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </ListItemButton>
        )}
      </List>
    </FlexBox>
  )
}

export interface IActionList<T extends ChatThread | ChatMessage> {
  actionItem: {
    item: T
    actions: {
      redux: ((dispatch: AppDispatch, id: string) => void)
      dbDelete?: ((userId: string, item: T) => Promise<SupabaseRes>)
      dbUpdate?: {
        fn: ((userId: string, thread: T, value: Partial<UpdateableThreadColumns>) => Promise<SupabaseRes>)
        values: Partial<UpdateableThreadColumns>
      }
      icon: React.ReactNode
      label: string
      color: string
    }[]
  }
  subheader: string
  anchorIcon: React.ReactNode
  anchorWidth: string
  anchorHeight: string
}

const ActionsPopover = <T extends ChatThread | ChatMessage> ({
  actionItem,
  subheader,
  anchorIcon,
  anchorWidth,
  anchorHeight
}: IActionList<T>) => {
  const dispatch = useAppDispatch()
  const isMobileOS = useIsMobileOS()
  const { user } = useUser()
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(popoverAnchorEl)

  const handlePopoverBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null)
  }

  const listItemButtons = actionItem.actions.map((action) => (
    <ListItemButton 
      key={action.label}
      aria-label={action.label}
      onClick={async () => { 
        action.redux(dispatch, actionItem.item.id);
        if (user && action.dbDelete) {
          await action.dbDelete(user.id, actionItem.item)
        };
        if (user && action.dbUpdate) {
          await action.dbUpdate.fn(user.id, actionItem.item, action.dbUpdate.values)
        };
        handlePopoverClose()
      }} 
      sx={{ 
        height: "2.5rem", 
        paddingRight: "1.25rem"
      }}
    >
      <ListItemIcon sx={{ 
        minWidth: "0", 
        marginRight: "0.375rem", 
        "& > svg": {
          color: action.color,
        }
      }}>
        {action.icon}
      </ListItemIcon>
      <ListItemText 
        primary={action.label} 
        sx={{ 
          "& > .MuiTypography-root": { 
            color: action.color, 
            fontWeight: "600",
            textTransform: "capitalize",
            textWrap: "nowrap"
          }
        }} 
      />
    </ListItemButton>
  ))

  return (
    <Box>
      <IconButton 
        aria-label="Open actions popover"
        aria-haspopup="true"
        onClick={handlePopoverBtnClick} 
        sx={{ 
          display: (isMobileOS ? "flex" : "none"), 
          width: (anchorWidth),
          height: (anchorHeight)
        }}
      >
        {anchorIcon}
      </IconButton>
      <Popover 
        open={open} 
        onClose={handlePopoverClose}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        sx={{
          width: "75%",
          "& .MuiPaper-root": {
            background: "transparent",
            backdropFilter: "blur(5px)"
          }
        }}
      >
        <List sx={{ 
          paddingTop: "0", 
          paddingBottom: "0.25rem", 
          backgroundColor: alpha(theme.palette.secondary.contrastText, 0.7),
          boxShadow: `inset 0 0 0 1px ${theme.palette.secondary.dark}`,
          borderRadius: "0.4rem"
        }}>
          <ListSubheader sx={{
            lineHeight: "2rem",
            fontWeight: "600",
            color: "secondary.light",
            backgroundColor: alpha(theme.palette.highlight.dark, 0.7),
            boxShadow: `inset 0 0 0 1px ${theme.palette.secondary.dark}`,
            borderRadius: "0.4rem 0.4rem 0 0"
          }}>
            {subheader}
          </ListSubheader>

          {listItemButtons}
        </List>
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
      aria-label={value}
    >
      {value}
    </ToggleButton>
  ))

  return (
    <ToggleButtonGroup sx={{
      height: "1.75rem",
    }}
      size="small"
      value={activeTab}
    >
      {toggleButtons}
    </ToggleButtonGroup>
  )
}

interface IDeleteButton<T extends ChatThread | ChatMessage> {
  action: (dispatch: AppDispatch, itemId: string) => void
  dbAction?: (userId: string, item: T) => Promise<SupabaseRes>
  userId?: string
  item: T
  location: "threads" | "chat-history",
}

const DeleteButton = <T extends ChatThread | ChatMessage>({
  action,
  dbAction,
  userId,
  item,
  location
}: IDeleteButton<T>) => {
  const dispatch = useAppDispatch()
  const isMobileOS = useIsMobileOS()

  const handleClick = () => {
    action(dispatch, item.id)
    if (dbAction && userId && item) {
      dbAction(userId, item)
    }
  }

  return (
    <Button 
      onClick={handleClick}
      tabIndex={-1}
      aria-label="Delete"
      className="actionButton"
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
        zIndex: "10",
        display: (isMobileOS ? "none" : "flex"),
        flexDirection: "column",
        gap: "0.25rem",
        width: "2.5rem",
        height: "100%",
        borderRadius: "0 10px 10px 0",
        color: "secondary.contrastText",
        bgcolor: alpha(theme.palette.error.dark, 0.66),
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

interface IArchiveButton<T extends ChatThread> {
  action: (dispatch: AppDispatch, itemId: string) => void
  dbAction?: {
    fn: ((userId: string, thread: T, value: Partial<UpdateableThreadColumns>) => Promise<SupabaseRes>)
    values: Partial<UpdateableThreadColumns>
  }
  userId?: string
  item: T
  location: "active" | "archived"
}

const ArchiveButton = <T extends ChatThread>({
  action,
  dbAction,
  userId,
  item,
  location
}: IArchiveButton<T>) => {
  const dispatch = useAppDispatch()
  const isMobileOS = useIsMobileOS()

  const handleClick = () => {
    action(dispatch, item.id)
    if (dbAction && userId && item) {
      dbAction.fn(userId, item, dbAction.values)
    }
  }

  return (
    <Button 
      onClick={handleClick}
      tabIndex={-1}
      aria-label="Archive/Restore toggle"
      className="actionButton"
      sx={{
        position: "absolute",
        top: "0",
        right: "2.5rem",
        zIndex: "10",
        display: (isMobileOS ? "none" : "flex"),
        flexDirection: "column",
        gap: "0.25rem",
        width: "2.5rem",
        height: "100%",
        borderRadius: "0",
        color: "secondary.contrastText",
        bgcolor: alpha(theme.palette.info.main, 0.66),
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

const LoadingDialog = ({
  open,
  message
}: {
  open: boolean
  message: string
}) => {
  if (!open) return null
  
  return (
    <Dialog 
      open={open} 
      sx={{ 
        "& .MuiPaper-root": {
          background: "transparent",
          boxShadow: "none",
          "& svg": {
            animation: "spin 0.8s linear infinite"
          } 
        }
      }}
    >
      <FlexBox sx={{
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}>
        <SpinnerGap size={36} weight="bold" />
        <Typography>{message}</Typography>
      </FlexBox>
    </Dialog>
  )
}


export {
  FlexBox,
  ToolTip,
  TabNav,
  MenuNav,
  ActionsPopover,
  ToggleGroup,
  ArchiveButton,
  DeleteButton,
  LoadingDialog
}
