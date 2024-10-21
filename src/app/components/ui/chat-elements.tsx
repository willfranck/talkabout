import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useAppDispatch } from "@redux/hooks"
import { 
  useSelectedThread, 
  useMessageHistory 
} from "@hooks/chat"
import { 
  ChatThread, 
  ChatMessage 
} from "@types"
import { 
  selectActiveThread, 
  removeThread, 
  archiveThread,
  restoreThread,
  deleteMessage, 
  displayTextByChar
} from "@globals/functions"
import theme from "@utils/mui-theme"
import {
  alpha,
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  Input,
} from "@mui/material"
import {
  FlexBox,
  ToolTip, 
  ArchiveButton,
  DeleteButton
} from "@ui/mui-elements"
import { 
  CaretCircleRight,
  UserCircle, 
  Fire, 
  Snowflake,
} from "@phosphor-icons/react/dist/ssr"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"

//// Chat Elements
const ThreadCard = ({ 
  thread, 
}: {
  thread: ChatThread
}) => {
  const dispatch = useAppDispatch()
  const [threadTopic, setThreadTopic] = useState("")

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
          padding: "0.5rem 1rem 0.5rem 0.5rem",
          bgcolor: (thread.selected ? alpha(theme.palette.primary.main, 0.45) : ""),
          backdropFilter: "blur(20px)",
          opacity: "0",
          animation: "fadeInFromLeft 240ms ease-out forwards",
          cursor: "pointer",
          overflow: "hidden",
          "& .actionButton": {
            opacity: "0",
            animation: "fadeOutToRight 240ms ease-out forwards"
          },
          "&:hover": {
            backgroundColor: (!thread.selected ? alpha(theme.palette.info.dark, 0.5) : ""),
            "& .actionButton": {
              visibility: "visible",
              animation: "fadeInFromRight 240ms ease-out 60ms forwards"
            },
          },
        }}
      >
        <FlexBox 
          onClick={() => selectActiveThread(dispatch, thread.id)}
          sx={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <FlexBox sx={{
            flexDirection: "column",
            alignItems: "start",
            gap: "0.25rem",
            paddingX: "0.5rem"
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
              id="threadCreated" 
              variant="body2" 
              color={thread.selected ? "highlight.light" : "highlight.main"}
            >
              {new Date(thread.created).toLocaleDateString()}
            </Typography>
          </FlexBox>
          {thread.selected && (
            <CaretCircleRight size={24} />
          )}
        </FlexBox>
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

const ChatMessageCard = ({
  message
}: {
  message: ChatMessage
}) => {
  return (
    <Card sx={{
      position: "relative",
      alignSelf: (message.role === "user" ? "end" : "start"),
      flexShrink: "0",
      width: "fit-content",
      maxWidth: { xs: "92%", md: "86%" },
      padding: "1rem",
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
        animation: "fadeOutToRight 240ms ease-out forwards"
      },
      "&:hover": {
        "& .actionButton": {
          visibility: "visible",
          animation: "fadeInFromRight 240ms ease-out 60ms forwards"
        },
      },
    }}>
      <FlexBox sx={{
        alignItems: "start",
        gap: "1rem",
      }}>
        {message.role === "model" && (
          <Image 
            src={"/images/Llama.webp"} 
            alt="Llama logo" 
            width={20} 
            height={20} 
            className="w-5 h-auto mt-0.5 rounded-full invert dark:invert-0" 
          />
        )}
        <FlexBox sx={{
          flexDirection: "column",
          alignItems: (message.role === "model" ? "start" : "end"),
          gap: "0.5rem",
        }}>
          <FlexBox sx={{
            flexDirection: "column",
            alignItems: "start",
            gap: "0.5rem",
            width: "100%",
          }}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
          </FlexBox>
          <Typography variant="body2" color="primary.main">
            {new Date(message.timestamp).toLocaleDateString()}{" - "}
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </FlexBox>
        {message.role === "user" && (
          <>
            <UserCircle size={24} weight="duotone" />
            <DeleteButton 
              action={deleteMessage} 
              itemId={message.id} 
              location="chat-history" 
            />
          </>
        )}
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
  const threadRef = useRef(selectedThread?.id) 
  const messageHistory = useMessageHistory()
  const messagesRef = useRef(messageHistory.length)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const { current } = scrollAreaRef
    const currentMessages = messageHistory.length
    // Handles thread being switched
    if (threadRef.current !== selectedThread?.id) {
      threadRef.current = selectedThread?.id
      messagesRef.current = currentMessages
      if (current) {
        requestAnimationFrame(() => {
          current.scrollTo({ top: current.scrollHeight, behavior: "instant" })
        })
      }
    // Handles NEW messages || page navigation
    } else {
      if (current) {
        if (currentMessages > messagesRef.current) {
          requestAnimationFrame(() => {
            current.scrollTo({ top: current.scrollHeight, behavior: "smooth" })
          })
        } else {
          requestAnimationFrame(() => {
            current.scrollTo({ top: current.scrollHeight, behavior: "instant" })
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
        padding: "1.5rem",
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
        <ChatMessageCard key={message.id} message={message} />
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
          width: "1.8rem",
          height: "6rem",
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
  const handleSubmitKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (prompt.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <FormControl 
      component="form"
      variant="outlined"
      onSubmit={onSubmit}
      sx={{
        width: { xs: "90%", md: "100%" }
      }}
    >
      <InputLabel htmlFor="input-with-icon-adornment">
        Chat
      </InputLabel>
      <Input
        multiline
        rows="5"
        startAdornment={
          <InputAdornment position="start" sx={{ marginRight: "1rem" }}>
            <TemperatureControls 
              temperatureHot={temperatureSettings.hot}
              temperatureNormal={temperatureSettings.normal}
              temperatureCold={temperatureSettings.cold}
              defaultTemperature={defaultTemperature}
              onTemperatureChange={onTemperatureChange}
            />
          </InputAdornment>
        }
        value={prompt}
        placeholder="Message Llamini-Flash"
        disabled={threads === 0 || selectedThread === undefined}
        onChange={onChange}
        onKeyDown={handleSubmitKeyDown}
      />
    </FormControl>
  )
}


export { 
  ChatHistoryTabs, 
  ChatHistory, 
  ChatInputField, 
}
