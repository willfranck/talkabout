import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useAppDispatch } from "@redux/hooks"
import { useIsMobileOS } from "@hooks/global"
import { 
  useSelectedThread, 
  useMessageHistory 
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
import theme from "@utils/mui-theme"
import {
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
  PaperPlaneRight
} from "@phosphor-icons/react/dist/ssr"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import hljs from "highlight.js"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"

//// Chat Elements
const ThreadCard = ({ 
  thread, 
}: {
  thread: ChatThread
}) => {
  const dispatch = useAppDispatch()
  const isMobileOS = useIsMobileOS()
  const [threadTopic, setThreadTopic] = useState("")

  const actionItemProps: IActionList["actionItem"] = {
    item: thread,
    actions: [
      {
        function: archiveThread,
        label: "Archive",
        icon: <Archive size={24} />,
        color: theme.palette.primary.main
      },
      {
        function: removeThread,
        label: "Delete",
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
              action={
                thread.category === "active" 
                ? archiveThread 
                  : thread.category === "archived" 
                  ? restoreThread 
                    : () => {}
              } 
              itemId={thread.id} 
              location={thread.category}
            />
            <DeleteButton 
              action={removeThread} 
              itemId={thread.id} 
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
  const match = /language-(\w+)/.exec(className || "");

  return !inline && match ? (
    <pre className={className} {...props}>
      <code className={className}>
        {children}
      </code>
    </pre>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

const ChatMessageCard = ({
  message
}: {
  message: ChatMessage
}) => {
  const actionItemProps: IActionList["actionItem"] = {
    item: message,
    actions: [
      {
        function: deleteMessage,
        label: "delete",
        icon: <Trash size={24} />,
        color: theme.palette.error.main
      }
    ]
  }

  // Initializes highlighting if the element hasn't been highlighted already, preventing re-renders **Only works on desktop**
  // useEffect(() => {
  //   document.querySelectorAll("code").forEach((block) => {
  //     const codeBlock = block as HTMLElement
  //     if (codeBlock.dataset.highlighted !== "yes") {
  //       hljs.highlightElement(codeBlock)
  //       codeBlock.dataset.highlighted = "yes"
  //     }
  //   })
  // }, [message])

  // Works on both desktop and mobile, but it may cause re-renders
  useEffect(() => {
    hljs.highlightAll()
  }, [])

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
              <ReactMarkdown 
                components={{
                  code: CodeBlock 
                }}
                remarkPlugins={[
                  remarkGfm,
                ]} 
                rehypePlugins={[
                  [rehypeSanitize, defaultSchema],
                  rehypeHighlight
                ]
              }>
                {message.content}
              </ReactMarkdown>
            )}
            <FlexBox sx={{ 
              gap: "0.375rem"
            }}>
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
                    itemId={message.id} 
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
  const messageHistory = useMessageHistory()
  const messagesRef = useRef<number>(messageHistory.length)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const scrollOffset = 32
  
  useEffect(() => {
    // Handles initial page load
    const { current } = scrollAreaRef
    if (current) {
      requestAnimationFrame(() => {
        current.scrollTo({ top: current.scrollHeight + scrollOffset, behavior: "instant" })
      })
    }
  }, [])

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
        if (currentMessages > messagesRef.current) {
          const newMessage = current.lastChild as HTMLElement
          const newMessageHeight = newMessage ? newMessage.offsetHeight : 0
          requestAnimationFrame(() => {
            current.scrollTo({ top: current.scrollHeight - (newMessageHeight + 12), behavior: "smooth" })
          })
        }
      }
    }
    messagesRef.current = currentMessages
  }, [messages, messageHistory, selectedThread])

  return (
    <FlexBox 
      ref={scrollAreaRef}
      sx={{
        flexDirection: "column",
        justifyContent: "start",
        gap: "1.5rem",
        padding: { xs: "1.5rem 1.5rem 0 1.5rem", md: "1.5rem" },
        width: "100%",
        height: "100%",
        overflowY: "auto"
      }}
    >
      {messages.length === 0 && (
        <FlexBox sx={{
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          height: "100%",
          animation: "fadeIn 240ms ease-out forwards"
        }}>
          <Image 
            src={"./images/Llama.webp"}
            alt="Llama logo"
            width={128}
            height={128}
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
  const tooltipContent = `Adjust the responses to suit the mood\n-\nHot - Spicy, Fun, Unhinged\nCold - Relaxed, Cheeky, Informative\n_`
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
          borderRadius: "0.4rem"
        }}
          selected={temperatureHot === aiTemperature}
          value={temperatureHot}
          onClick={(e) => handleButtonClick(e, temperatureHot)}
        >
          <Fire size={20} weight="bold" />
        </ToggleButton>
        <ToggleButton sx={{
          height: "50%",
          borderRadius: "0.4rem"
        }}
          value={temperatureCold}
          selected={temperatureCold === aiTemperature}
          onClick={(e) => handleButtonClick(e, temperatureCold)}
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
              sx={{ 
                width: "2rem",
                height: (isMobileOS ? "4.125rem" : "6rem"),
                borderRadius: "0.4rem" 
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
