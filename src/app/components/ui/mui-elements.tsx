import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AppDispatch } from "@redux/store"
import { useAppDispatch } from "@redux/hooks"
import {
  alpha,
  Box,
  BoxProps,
  Button,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  TooltipProps,
  tooltipClasses
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { 
  Trash, 
  ArrowDown 
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
    <Link href={link.path} className="outline-none">
      <Tab 
        key={link.name} 
        label={link.icon}
        sx={{ 
          color: (link.path === pathname ? "primary.light" : "secondary.light"),
          "&:hover": { color: "secondary.contrastText" }
        }}
      />
    </Link>
  ))
  
  return (
    <Tabs value={tabIndex}>
      {linkElements}
    </Tabs>
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
  location: "chat-history" | "threads"
}

const DeleteButton = ({
  action,
  itemId,
  location
}: IDeleteButton) => {
  const dispatch = useAppDispatch()

  return (
    <Button 
      onClick={() => action(dispatch, itemId)}
      tabIndex={-1}
      sx={{
        position: "absolute",
        top: "0",
        right: "0",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        width: "3.5rem",
        height: "100%",
        borderRadius: "0",
        color: "secondary.contrastText",
        bgcolor: "#C12114",
        opacity: "0",
      }} 
      className="group-hover:opacity-100"
    >
      <Trash size={23} color="currentColor" />
      {location === "chat-history" && (
        <ArrowDown size={20} />
      )}
    </Button>
  )
}


export {
  FlexBox,
  ToolTip,
  Nav,
  ToggleGroup,
  DeleteButton,
}