"use client"
import { useState, useEffect, useRef } from "react"
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
  useActiveThread, 
  useMessageHistory 
} from "@hooks/chat"
import { ChatMessage } from "@types"
import { ChatInputField } from "@ui/chat-elements"


export const ChatInput = () => {
  const dispatch = useAppDispatch()
  const threadCount = useThreadCount()
  const activeThread = useActiveThread()
  const activeThreadRef = useRef<string | undefined>(undefined)
  const messageHistory = useMessageHistory()
  const [userPrompt, setUserPrompt] = useState("")
  const [aiTemperature, setAiTemperature] = useState(temperatureSettings.hot)
  
  const handleTemperatureChange = (value: number) => {
    setAiTemperature(value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value)
  }

  const getTopic = async () => { 
    const reply = await axios.post("/api/chat-topic", { history: messageHistory })
    if (reply.data.res) {
      const topic = reply.data.res
      dispatch(updateThreadTopic(topic))
    }
  }

  useEffect(() => {
    if (activeThreadRef.current !== activeThread?.id) {
      activeThreadRef.current = activeThread?.id
      return
    }
    if (messageHistory.length > 0 && messageHistory.length % 4 === 2) {  
      getTopic()
    }
  }, [messageHistory])

  const handleSubmit = async () => {
    if (activeThread) {
      try {
        const userMessage: ChatMessage = { 
          id: crypto.randomUUID(),
          role: "user", 
          content: userPrompt, 
          date: new Date().toISOString()
        }
        setUserPrompt("")
        dispatch(addMessage(userMessage))
        dispatch(updateLastActive(new Date().toISOString()))

        const aiReply = await axios.post("/api/chat", { history: messageHistory, prompt: userPrompt, temperature: aiTemperature })
        if (aiReply.data.res) {
          const content = aiReply.data.res
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "model",
            content: content,
            date: new Date().toISOString()
          }
          dispatch(addMessage(aiMessage))
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <ChatInputField 
      prompt={userPrompt} 
      threads={threadCount}
      activeThread={activeThread}
      temperatureSettings={temperatureSettings}
      defaultTemperature={aiTemperature}
      onTemperatureChange={handleTemperatureChange}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  )
}
