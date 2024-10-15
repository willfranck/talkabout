import { useState, useEffect, useRef } from "react"
import { cn } from "@utils/clsx"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { useAppDispatch } from "@redux/hooks"
import { 
  ChatThread, 
  ChatMessage 
} from "@types"
import { 
  selectActiveThread, 
  removeThread, 
  deleteMessage, 
  displayTextByChar
} from "@globals/functions"
import { 
  Flex,
  Box, 
  Card, 
  ScrollArea, 
  TextArea, 
  RadioCards, 
  Button,
  Heading,  
  Text 
} from "@radix-ui/themes"
import {
  DeleteButton 
} from "@ui/radix-elements"
import { 
  CaretCircleRight, 
  UserCircle, 
  ThermometerSimple,
  ThermometerHot, 
  ThermometerCold,
  PaperPlaneTilt
} from "@phosphor-icons/react/dist/ssr"

//// Chat Elements
interface ThreadCardProps {
  thread: ChatThread,
}

const ThreadCard = ({ 
  thread, 
}: ThreadCardProps) => {
  const dispatch = useAppDispatch()
  const [threadTopic, setThreadTopic] = useState("")

  useEffect(() => {
    displayTextByChar(thread.topic, setThreadTopic)
  }, [thread.topic])

  return (
    <Card
      key={thread.id}
      variant="surface"
      className={cn("relative group w-full pl-2 cursor-pointer opacity-0 fade-in", {
        "bg-gray-600": thread.active,
        "hover:bg-gray-700": !thread.active,
      })}
      style={{ animationDelay: "120ms" }}
    >
      <Flex
        direction="row"
        align="center"
        justify="between"
        onClick={() => selectActiveThread(dispatch, thread.id)}
      >
        <Flex direction="column" gap="1" px="2">
          <Heading size="2" trim="start" className="min-h-4 line-clamp-1 fade-in">
            {threadTopic}
          </Heading>
          <Text as="span" size="1">
            {new Date(thread.created).toLocaleDateString()}
          </Text>
        </Flex>
        <CaretCircleRight
          size={24}
          className={cn("opacity-0", {
            "opacity-100 text-[#0A0A0A] dark:text-[#EDEDED]": thread.active,
          })}
        />
      </Flex>
      <DeleteButton 
        action={removeThread} 
        itemId={thread.id} 
        location="threads" 
      />
    </Card>
  )
}

interface ChatHistoryTabProps {
  threads: ChatThread[]
}

const ChatHistoryTabs = ({
  threads
}: ChatHistoryTabProps) => {
  return (
    <Flex direction="column" align="center" gap="2" px="4" pb="2" width="100%">
      {threads.map((thread) => (
        <ThreadCard 
          key={thread.id} 
          thread={thread} 
        />
      ))}
    </Flex>
  )
}

interface ChatHistoryProps {
  messages: ChatMessage[]
}

const ChatHistory = ({
  messages
}: ChatHistoryProps) => {
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const { current } = scrollAreaRef
    if (current) {
      current.scrollTo({ top: current.scrollHeight, behavior: "smooth" })
    }
  }, [messages])

  return (
    <ScrollArea 
      type="hover"
      scrollbars="vertical"
      ref={scrollAreaRef}
      className="flex-1 pr-12"
    >
      <Flex direction="column" gap="6" pt="6" width="100%" height="100%">
        {messages.length === 0 && (
          <Flex direction="column" align="center" justify="center" gap="4" width="100%" height="100%" className="flex-1 fade-in">
            <Image 
              src={"./images/Llama.webp"}
              alt="Llama logo"
              width={128}
              height={128}
              className="w-32 h-auto rounded-logo opacity-30 invert dark:invert-0"
            />
            <Text as="span">much empty in here</Text>
          </Flex>
        )}
        {messages.length > 0 && messages.map((message) => (
          <Card 
            key={message.id} 
            variant="surface" 
            className={cn("relative group w-fit max-w-[86%] bg-gray-600/80 dark:bg-gray-600/20 fade-in", {
              "self-end bg-gray-800/80 dark:bg-gray-800/20": message.role === "user"
            })}
          >
            <Flex gap="4" align="start">
              {message.role === "model" && (
                <Image src={"/images/Llama.webp"} alt="Llama logo" width={20} height={20} className="w-5 h-auto mt-0.5 ml-1 rounded-full invert dark:invert-0" />
              )}
              <Flex 
                direction="column" 
                gap="2" 
                className={cn({"items-end": message.role === "user"})}
              >
                <Flex direction="column" gap="2">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {message.content}
                  </ReactMarkdown>
                </Flex>
                <Text as="span" size="1">
                  {new Date(message.date).toLocaleDateString()}{" - "}
                  {new Date(message.date).toLocaleTimeString()}
                </Text>
              </Flex>
              {message.role === "user" && (
                <>
                  <UserCircle 
                    size={24} 
                    weight="duotone" 
                    className="text-gray-400 invert dark:invert-0" 
                  />
                  <DeleteButton 
                    action={deleteMessage} 
                    itemId={message.id} 
                    location="chat-history" 
                  />
                </>
              )}
            </Flex>
          </Card>
        ))}
      </Flex>
    </ScrollArea>
  )
}

interface TemperatureControlProps {
  temperatureHot: number
  temperatureNormal: number
  temperatureCold: number
  defaultTemperature: number
  onTemperatureChange: (value: number) => void
}

const TemperatureControls = ({
  temperatureHot,
  temperatureNormal,
  temperatureCold,
  defaultTemperature,
  onTemperatureChange
}: TemperatureControlProps) => {
  const [aiTemperature, setAiTemperature] = useState(defaultTemperature)
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, value: number) => {
    e.preventDefault()
    setAiTemperature(value)
    onTemperatureChange(value)
  }

  return (
    <Flex 
      direction="column"
      align="center" 
      justify="center"
      className="absolute top-0 left-0 w-10 h-full py-px rounded-left-only"
    >
      <Button
        variant="ghost"
        value={temperatureHot}
        aria-pressed={temperatureHot === aiTemperature}
        onClick={(e) => handleButtonClick(e, temperatureHot)}
        tabIndex={-1}
        className="flex-1 my-0 py-0 rounded-tl-only aria-pressed:bg-[#00384B]"
      >
        <ThermometerHot size={20} weight="bold" />
      </Button>
      {/* <Button
        variant="ghost"
        value={temperatureNormal}
        aria-pressed={temperatureNormal === aiTemperature}
        onClick={(e) => handleButtonClick(e, temperatureNormal)}
        tabIndex={-1}
        className="flex-1 my-0 py-0 rounded-none aria-pressed:bg-[#00384B]"
      >
        <ThermometerSimple size={20} weight="bold" />
      </Button> */}
      <Button
        variant="ghost"
        value={temperatureCold}
        aria-pressed={temperatureCold === aiTemperature}
        onClick={(e) => handleButtonClick(e, temperatureCold)}
        tabIndex={-1}
        className="flex-1 my-0 py-0 rounded-bl-only aria-pressed:bg-[#00384B]"
      >
        <ThermometerCold size={20} weight="bold" />
      </Button>
    </Flex>
  )
}

interface ChatInputProps {
  prompt: string
  threads: number
  activeThread: ChatThread | undefined
  temperatureSettings: { hot: number, normal: number, cold: number }
  defaultTemperature: number
  onTemperatureChange: (temperature: number) => void
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
}

const ChatInputField = ({ 
  prompt,
  threads,
  activeThread,
  temperatureSettings,
  defaultTemperature,
  onTemperatureChange, 
  onChange,
  onSubmit
}: ChatInputProps) => {
  const handleSubmitKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (prompt.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <form 
      onSubmit={onSubmit} 
      className="relative flex mt-auto mb-4 mr-12"
    >
      <TemperatureControls 
        temperatureHot={temperatureSettings.hot}
        temperatureNormal={temperatureSettings.normal}
        temperatureCold={temperatureSettings.cold}
        defaultTemperature={defaultTemperature}
        onTemperatureChange={onTemperatureChange}
      />
      <TextArea 
        variant="surface"
        size="3"
        value={prompt}
        placeholder="Message Llamini-Flash"
        disabled={threads === 0 || activeThread === undefined}
        onChange={onChange}
        onKeyDown={handleSubmitKeyDown}
        tabIndex={1}
        className="flex-1 h-36 px-10 whitespace-pre"
      />
      <Button 
        variant="soft"
        onClick={onSubmit}
        disabled={prompt.trim().length === 0}
        className="absolute bottom-0 right-0 w-10 h-full rounded-right-only"
      >
        <PaperPlaneTilt size={20} />
      </Button>
    </form>
  )
}


export { 
  ChatHistoryTabs, 
  ChatHistory, 
  ChatInputField, 
}
