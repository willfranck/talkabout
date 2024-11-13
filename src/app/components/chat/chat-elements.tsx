import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useAppDispatch } from "@redux/hooks"
import { useUser, useIsMobileOS } from "@hooks/global"
import { 
  useSelectedThread, 
  useThreadMessageHistory 
} from "@hooks/chat"
import { 
  ChatThread, 
  ChatMessage 
} from "@types"
import { 
  selectThread, 
  removeThread, 
  archiveThread,
  restoreThread,
  deleteMessage, 
  displayTextByChar
} from "@globals/functions"
import { 
  deleteThread, 
  deleteMessages, 
  updateDbThread 
} from "@services/supabase-actions"
import theme from "@utils/mui-theme"
import {
  useMediaQuery,
  alpha,
  Box,
  Card,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  InputAdornment,
  Input,
  Typography
} from "@mui/material"
import {
  IActionList,
  FlexBox,
  ActionsPopover,
  ToolTip, 
  ArchiveButton,
  DeleteButton
} from "@ui/mui-elements"
import { 
  DotsThreeVertical,
  UserCircle, 
  Fire, 
  Snowflake,
  Trash,
  Archive,
  PaperPlaneRight,
  ArrowCounterClockwise,
  Warning
} from "@phosphor-icons/react/dist/ssr"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"

//// Chat Elements
const ThreadCard = ({ 
  thread, 
}: {
  thread: ChatThread
}) => {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const isMobileOS = useIsMobileOS()
  const [threadTopic, setThreadTopic] = useState("")
  const isActive = thread.category === "active"

  const actionItemProps: IActionList<ChatThread>["actionItem"] = {
    item: thread,
    actions: [
      {
        redux: isActive ? archiveThread : restoreThread,
        dbUpdate: user ? {
          fn: updateDbThread, 
          values: {category: (isActive ? "archived" : "active")}
        } : undefined,
        label: isActive ? "archive" : "restore",
        icon: isActive ? <Archive size={24} /> : <ArrowCounterClockwise size={24} />,
        color: theme.palette.primary.main
      },
      {
        redux: removeThread,
        dbDelete: user ? deleteThread : undefined,
        label: "delete",
        icon: <Trash size={24} />,
        color: theme.palette.error.main
      }
    ]
  }

  useEffect(() => {
    displayTextByChar(thread.topic, setThreadTopic)
  }, [thread.topic])

  return (
    <ToolTip title={thread.topic.length >= 40 && thread.topic} placement="right" arrow>
      <Card 
        id="ThreadCard"
        key={thread.id}
        elevation={2}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "0.5rem",
          bgcolor: (thread.selected ? alpha(theme.palette.primary.main, 0.25) : ""),
          backdropFilter: "blur(20px)",
          boxShadow: (thread.selected ? `inset 0 0 0 1px ${theme.palette.highlight.main}` : ""),
          opacity: "0",
          animation: "fadeInFromLeft 240ms ease-out forwards",
          cursor: "pointer",
          overflow: "hidden",
          "& .actionButton": {
            opacity: "0",
            animation: "fadeOutToRight 240ms ease-out forwards"
          },
          "&:hover": {
            backgroundColor: (!thread.selected ? alpha(theme.palette.primary.dark, 0.4) : ""),
            "& .actionButton": {
              visibility: "visible",
              animation: "fadeInFromRight 240ms ease-out 60ms forwards"
            },
          },
        }}
      >
        <ActionsPopover 
          actionItem={actionItemProps} 
          subheader="Options" 
          anchorIcon={<DotsThreeVertical size={24} weight="bold" />}
          anchorWidth="1.375rem"
          anchorHeight="100%" 
        />
        <FlexBox 
          onClick={() => selectThread(dispatch, thread.id)}
          sx={{
            justifyContent: "start",
            width: "100%",
            paddingLeft: "0.25rem"
          }}
        >
          <FlexBox sx={{
            flexDirection: "column",
            alignItems: "start",
            gap: "0.25rem",
          }}>
            <Typography 
              variant="body1" 
              sx={{
                minHeight: "1rem",
                color: (thread.selected ? "secondary.contrastText" : "secondary.light"),
                fontWeight: "600"
              }}
              className="line-clamp-1"
            >
              {threadTopic}
            </Typography>
            <Typography 
              variant="body2" 
              color={thread.selected ? "highlight.light" : "highlight.main"}
            >
              {new Date(thread.created).toLocaleDateString(undefined, { dateStyle: "short" })}
            </Typography>
          </FlexBox>
        </FlexBox>
        {!isMobileOS && (
          <>
            <ArchiveButton 
              action={isActive ? archiveThread : restoreThread} 
              dbAction={user ? {
                fn: updateDbThread,
                values: {category: (isActive ? "archived" : "active" )}
              } : undefined}
              userId={user ? user.id : undefined}
              item={thread} 
              location={thread.category}
            />
            <DeleteButton 
              action={removeThread} 
              dbAction={user ? deleteThread : undefined}
              userId={user ? user.id : undefined}
              item={thread}
              location="threads" 
            />
          </>
        )}
      </Card>
    </ToolTip>
  )
}

const ChatHistoryTabs = ({
  threads
}: {
  threads: ChatThread[]
}) => {
  return (
    <FlexBox sx={{
      flexDirection: "column",
      gap: "0.5rem",
      width: "100%",
      paddingX: "1rem",
      paddingBottom: "0.5rem"
    }}>
      {threads.map((thread) => (
        <ThreadCard 
          key={thread.id} 
          thread={thread} 
        />
      ))}
    </FlexBox>
  )
}

const CodeBlock = ({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}) => {
  const match = /language-(\w+)/.exec(className || "")

  return !inline && match ? (
    <pre className={className} {...props}>
      <code className={className}>
        {children}
      </code>
    </pre>
  ) : (
    <code className="px-0.5 text-[12px] md:text-[14px] text-[#26C6DA] font-bold" {...props}>
      {children}
    </code>
  )
}

const ChatMessageCard = ({
  message
}: {
  message: ChatMessage
}) => {
  const { user } = useUser()
  const actionItemProps: IActionList<ChatMessage>["actionItem"] = {
    item: message,
    actions: [
      {
        redux: deleteMessage,
        dbDelete: deleteMessages,
        label: "delete",
        icon: <Trash size={24} />,
        color: theme.palette.error.main
      }
    ]
  }

  const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      "*": ["className", "id"],
      a: ["href", "target", "rel"]
    },
    tagNames: ["p", "span", "em", "strong", "a", "ol", "ul", "li", "code", "pre"]
  }

  const MarkdownRenderer = () => {
    try {
      return (
        <ReactMarkdown 
          components={{
            code: CodeBlock 
          }}
          remarkPlugins={[
            remarkGfm,
          ]} 
          rehypePlugins={[
            [rehypeSanitize, sanitizeSchema],
            rehypeHighlight
          ]}
        >
          {message.content}
        </ReactMarkdown>
      )
    } catch (error) {
      return (
        <FlexBox sx={{ gap: "0.5rem"}}>
          <Warning size={24} color={theme.palette.warning.light} />
          <Typography color={theme.palette.primary.light}>
            Something went wrong processing this message <br />
            Please delete your last message and try again
          </Typography>
        </FlexBox>
      )
    }
  }


  return (
    <Card sx={{
      position: "relative",
      alignSelf: (message.role === "user" ? "end" : "start"),
      flexShrink: "0",
      width: "fit-content",
      maxWidth: { xs: "95%", lg: "86%" },
      padding: "1.125rem 1rem 0.825rem",
      overflow: "visible",
      bgcolor: (
        message.role === "user" 
        ? alpha(theme.palette.primary.dark, 0.1) 
        : alpha(theme.palette.primary.dark, 0.25)
      ),
      backdropFilter: "blur(20px)",
      opacity: 0,
      animation: "fadeIn 240ms ease-out forwards",
      "& .actionButton": {
        opacity: "0",
        animation: "fadeOut 240ms ease-out forwards"
      },
      "&:hover": {
        "& .actionButton": {
          visibility: "visible",
          animation: "fadeIn 240ms ease-out 60ms forwards"
        },
      },
    }}>
      <FlexBox sx={{
        alignItems: "start",
        gap: "0.75rem",
      }}>
        {message.role === "model" && (
          <Box sx={{ 
            position: "absolute", 
            top: "-0.675rem", 
            left: "1rem" 
          }}>
            <Image 
              src={"/images/Llama.webp"} 
              alt="Llama logo" 
              width={20} 
              height={20} 
              className="w-5 h-auto mt-0.5 rounded-full invert dark:invert-0" 
            />
          </Box>
        )}
        {message.role === "user" && (
          <Box sx={{ 
            position: "absolute", 
            top: "-0.75rem", 
            right: "1rem", 
          }}>
            <UserCircle size={24} weight="duotone" />
          </Box>
        )}
          <FlexBox sx={{
            flexDirection: "column",
            alignItems: (message.role === "user" ? "end" : "start"),
            gap: "0.5rem",
            width: "100%",
            maxHeight: "fit-content",
            overflowWrap: "anywhere",
          }}>
            {message.role === "user" ? (
              <Typography>{message.content}</Typography>
            ) : (
              message.id === "0" ? (
                <Typography className="thinking italic">
                  {message.content}
                </Typography>
              ) : (
                <MarkdownRenderer />
              )
            )}
            <FlexBox sx={{ gap: "0.375rem" }}>
              {message.role === "user" ? (
                <>
                  <ActionsPopover 
                    actionItem={actionItemProps} 
                    subheader="Confirm" 
                    anchorIcon={<Trash size={16} color={theme.palette.error.main} />}
                    anchorWidth="1.5rem"
                    anchorHeight="1.25rem" 
                  />
                  <Typography
                    variant="body2" 
                    color="primary.main" 
                  >
                    {new Date(message.timestamp).toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}{"  |  "}
                    {new Date(message.timestamp).toLocaleTimeString(undefined, { timeStyle: "short" })}
                  </Typography>
                  <DeleteButton 
                    action={deleteMessage} 
                    dbAction={user ? deleteMessages : undefined}
                    userId={user ? user.id : undefined}
                    item={message}
                    location="chat-history" 
                  />
                </>
              ) : (
                <Typography
                  variant="body2" 
                  color="primary.main"
                >
                  {new Date(message.timestamp).toLocaleTimeString(undefined, { timeStyle: "short" })}{"  |  "}
                  {new Date(message.timestamp).toLocaleDateString(undefined, { month: "numeric", day: "numeric" })}
                </Typography>
              )}
            </FlexBox>
          </FlexBox>
      </FlexBox>
    </Card>
  )
}

const ChatHistory = ({
  messages
}: {
  messages: ChatMessage[]
}) => {
  const selectedThread = useSelectedThread()
  const threadRef = useRef<string | undefined>(selectedThread?.id) 
  const [threadBanner, setThreadBanner] = useState("")
  const messageHistory = useThreadMessageHistory()
  const messagesRef = useRef<number>(0)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"))
  const scrollOffset = isMdScreen ? 32 : 54
  
  useEffect(() => {
    // Handles initial page load
    const { current } = scrollAreaRef
    if (current) {
      requestAnimationFrame(() => {
        current.scrollTo({ top: current.scrollHeight + scrollOffset, behavior: "instant" })
      })
    }
  }, [scrollOffset])

  useEffect(() => {
    const { current } = scrollAreaRef
    const currentMessages = messageHistory.length
    // Handles thread being switched
    if (threadRef.current !== selectedThread?.id) {
      threadRef.current = selectedThread?.id
      messagesRef.current = currentMessages
      if (current) {
        requestAnimationFrame(() => {
          current.scrollTo({ top: current.scrollHeight + scrollOffset, behavior: "instant" })
        })
      }
    // Handles NEW messages
    } else {
      if (current) {
        if (currentMessages >= messagesRef.current && messagesRef.current !== 0) {
          const newMessage = current.lastChild as HTMLElement
          const newMessageHeight = newMessage ? newMessage.offsetHeight : 0
          requestAnimationFrame(() => {
            current.scrollTo({ top: current.scrollHeight - (newMessageHeight + scrollOffset), behavior: "smooth" })
          })
        }
      }
    }
    messagesRef.current = currentMessages
  }, [messages, messageHistory, selectedThread, scrollOffset])

  useEffect(() => {
    if (selectedThread) {
      displayTextByChar(selectedThread.topic, setThreadBanner)
    }
  }, [selectedThread, selectedThread?.topic])

  return (
    <FlexBox 
      ref={scrollAreaRef}
      sx={{
        flexDirection: "column",
        justifyContent: "start",
        gap: "1.5rem",
        padding: { xs: "3.25rem 1.5rem 0 1.5rem", md: "2rem 1.5rem 1rem" },
        width: "100%",
        height: "100%",
        overflowY: "auto"
      }}
    >
      <FlexBox sx={{ 
        display: { xs: "flex", md: "none" },
        position: "absolute",
        top: "3.5rem",
        zIndex: "10",
        width: "100%",
        paddingY: "0.5rem",
        backgroundColor: alpha("#141414", 0.5),
        backdropFilter: "blur(20px)"
      }}>
        <Typography 
          variant="body1"
          fontWeight="bold"
          color={theme.palette.primary.light}
          sx={{ paddingX: "1rem" }}
          className="line-clamp-1 overflow-hidden text-ellipsis"
        >
          {threadBanner}
        </Typography>
      </FlexBox>
      {messages.length === 0 && (
        <FlexBox sx={{
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          height: "100%",
          opacity: "0",
          animation: "fadeIn 240ms ease-out forwards"
        }}>
          <Image 
            src={"./images/Llama.webp"}
            alt="Llama logo"
            width={128}
            height={128}
            priority
            className="w-32 h-auto rounded-logo opacity-30 invert dark:invert-0"
          />
          <Typography variant="body2">much empty in here</Typography>
        </FlexBox>
      )}
      {messages.length > 0 && messages.map((message) => (
        <ChatMessageCard 
          key={message.id} 
          message={message} 
        />
      ))}
    </FlexBox>
  )
}

interface ITemperature {
  temperatureHot: number
  temperatureNormal: number
  temperatureCold: number
  defaultTemperature: number
  onTemperatureChange: (value: number) => void
}

const TemperatureControls = ({
  temperatureHot,
  temperatureCold,
  defaultTemperature,
  onTemperatureChange
}: ITemperature) => {
  const isMobileOS = useIsMobileOS()
  const tooltipContent = `Adjust the responses to suit the mood\n-\nHot:  Spicy, Fun, Unhinged\nCold:  Relaxed, Cheeky, Informative\n_`
  const [aiTemperature, setAiTemperature] = useState(defaultTemperature)
  const handleButtonClick = (e: React.MouseEvent<HTMLElement>, value: number) => {
    e.preventDefault()
    setAiTemperature(value)
    onTemperatureChange(value)
  }

  return (
    <ToolTip title={tooltipContent} placement="left" arrow>
      <ToggleButtonGroup 
        orientation="vertical"
        exclusive
        sx={{
          width: "1.75rem",
          height: (isMobileOS? "4.25rem" : "6rem"),
          borderRadius: "2px"
        }}
      >
        <ToggleButton sx={{
          height: "50%",
          borderRadius: "0.375rem"
        }}
          selected={temperatureHot === aiTemperature}
          value={temperatureHot}
          onClick={(e) => handleButtonClick(e, temperatureHot)}
          aria-label="Set AI temperature to hot"
        >
          <Fire size={20} weight="bold" />
        </ToggleButton>
        <ToggleButton sx={{
          height: "50%",
          borderRadius: "0.375rem"
        }}
          value={temperatureCold}
          selected={temperatureCold === aiTemperature}
          onClick={(e) => handleButtonClick(e, temperatureCold)}
          aria-label="Set AI temperature to cold"
        >
          <Snowflake size={20} weight="bold" />
        </ToggleButton>
      </ToggleButtonGroup>
    </ToolTip>
  )
}

interface IChatInput {
  prompt: string
  threads: number
  selectedThread: ChatThread | undefined
  temperatureSettings: { hot: number, normal: number, cold: number }
  defaultTemperature: number
  onTemperatureChange: (temperature: number) => void
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
}

const ChatInputField = ({ 
  prompt,
  threads,
  selectedThread,
  temperatureSettings,
  defaultTemperature,
  onTemperatureChange, 
  onChange,
  onSubmit
}: IChatInput) => {
  const isMobileOS = useIsMobileOS()
  const handleSubmitKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (prompt.trim().length > 0 && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
      if (isMobileOS) {
        e.currentTarget.blur()
      }
    }
  }

  return (
    <FormControl 
      component="form"
      variant="outlined"
      onSubmit={onSubmit}
      sx={{
        width: { xs: "92%", sm: "100%" }
      }}
    >
      <InputLabel htmlFor="input-with-icon-adornment">
        Chat
      </InputLabel>
      <Input
        multiline
        rows={isMobileOS ? "3" : "5"}
        value={prompt}
        placeholder="Message Llamini-Flash"
        disabled={threads === 0 || selectedThread === undefined}
        onChange={onChange}
        onKeyDown={handleSubmitKeyDown}
        slotProps={{
          input: {
            enterKeyHint: "go"
          }
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ marginRight: "0.75rem" }}>
            <TemperatureControls 
              temperatureHot={temperatureSettings.hot}
              temperatureNormal={temperatureSettings.normal}
              temperatureCold={temperatureSettings.cold}
              defaultTemperature={defaultTemperature}
              onTemperatureChange={onTemperatureChange}
            />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Button 
              variant="contained"
              onClick={onSubmit}
              aria-label="Send message"
              sx={{ 
                width: "2rem",
                height: (isMobileOS ? "4.125rem" : "6rem"),
                borderRadius: "0.375rem" 
              }}
            >
              <PaperPlaneRight size={20} color={theme.palette.secondary.contrastText} />
            </Button>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}


export { 
  ChatHistoryTabs, 
  ChatHistory, 
  ChatInputField, 
}
