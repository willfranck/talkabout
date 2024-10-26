"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { useAppDispatch } from "@redux/hooks"
import { temperatureSettings } from "@globals/values"
import { 
  addMessage, 
  updateLastActive, 
  updateThreadTopic 
} from "@redux/reducers"
import { 
  useThreadCount, 
  useSelectedThread, 
  useMessageHistory 
} from "@hooks/chat"
import { ChatMessage } from "@types"
import theme from "@utils/mui-theme"
import { 
  alpha, 
  Button 
} from "@mui/material"
import { FlexBox } from "@ui/mui-elements"
import { ChatInputField } from "@ui/chat-elements"
import { ChatTeardropText } from "@phosphor-icons/react/dist/ssr"


export const ChatInput = ({
  onButtonClick,
}: {
  onButtonClick: (event: React.MouseEvent<HTMLElement>) => void
}) => {
  const dispatch = useAppDispatch()
  const threadCount = useThreadCount()
  const selectedThread = useSelectedThread()
  const threadRef = useRef<string | undefined>(undefined)
  const messageHistory = useMessageHistory()
  const messagesRef = useRef(messageHistory.length)
  const [userPrompt, setUserPrompt] = useState("")
  const [aiTemperature, setAiTemperature] = useState(temperatureSettings.hot)

  const handleTemperatureChange = (value: number) => {
    setAiTemperature(value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value)
  }

  const getTopic = useCallback(async () => { 
    const reply = await axios.post("/api/chat-topic", { history: messageHistory })
    if (reply.data.res) {
      const topic = reply.data.res
      dispatch(updateThreadTopic(topic))
    }
  }, [dispatch, messageHistory])

  useEffect(() => {
    // Prevents getTopic() if selected thread hasn't changed || on page navigation
    if (threadRef.current !== selectedThread?.id) {
      threadRef.current = selectedThread?.id
      return
    }
    // Runs getTopic() only on NEW messages
    const currentMessages = messageHistory.length
    if (currentMessages > messagesRef.current) {
      if (currentMessages > 0 && currentMessages % 4 === 2) {
        getTopic();
      }
    }
    messagesRef.current = currentMessages
  }, [selectedThread, messageHistory, getTopic])

  const handleSubmit = async () => {
    if (selectedThread) {
      try {
        const userMessage: ChatMessage = { 
          id: crypto.randomUUID(),
          role: "user", 
          content: userPrompt, 
          timestamp: new Date().toISOString()
        }
        dispatch(addMessage(userMessage))
        dispatch(updateLastActive(new Date().toISOString()))
        setUserPrompt("")

        const aiReply = await axios.post("/api/chat", { history: messageHistory, prompt: userPrompt, temperature: aiTemperature })
        if (aiReply.data.res) {
          const content = aiReply.data.res
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "model",
            content: content,
            timestamp: new Date().toISOString()
          }
          dispatch(addMessage(aiMessage))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <FlexBox sx={{
      position: "relative",
      width: "100%"
    }}>
      <Button 
        size="small" 
        onClick={onButtonClick}
        sx={{
          position: "absolute",
          bottom: "9.75rem",
          left: "0",
          display: { xs: "flex", md: "none" },
          width: "1.375rem",
          height: "5rem",
          backgroundColor: alpha(theme.palette.primary.dark, 0.25),
          borderRadius: "0 10px 10px 0",
        }}
      >
        <ChatTeardropText size={16} weight="fill" color={theme.palette.primary.light} />
      </Button>
      <ChatInputField 
        prompt={userPrompt} 
        threads={threadCount}
        selectedThread={selectedThread}
        temperatureSettings={temperatureSettings}
        defaultTemperature={aiTemperature}
        onTemperatureChange={handleTemperatureChange}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </FlexBox>
  )
}
