"use client"
import { useState } from "react"
import axios from "axios"
import { 
  useAppSelector, 
  useAppDispatch 
} from "@redux/hooks"
import { 
  addMessage, 
  updateLastActive, 
  updateThreadTopic 
} from "@redux/reducers"
import { temperatureSettings } from "@globals/values"
import { ChatMessage } from "@types"
import { ChatInputField } from "@ui/chat-elements"


export const ChatInput = () => {
  const dispatch = useAppDispatch()
  const [userPrompt, setUserPrompt] = useState("")
  const threadCount = useAppSelector((state) => state.chat.threads.length)
  const activeThread = useAppSelector((state) => state.chat.threads.find(thread => thread.active))
  const messageHistory = activeThread?.messages || []
  const [aiTemperature, setAiTemperature] = useState(temperatureSettings.hot)
  
  const handleTemperatureChange = (value: number) => {
    setAiTemperature(value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value)
  }

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

        const reply = await axios.post("/api/chat", { history: messageHistory, prompt: userPrompt, temperature: aiTemperature })
        if (reply.data.res) {
          const content = reply.data.res
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "model",
            content: content,
            date: new Date().toISOString()
          }
          dispatch(addMessage(aiMessage))
          
          const getTopic = await axios.post("/api/chat-topic", { history: messageHistory })
          if (reply.data.res) {
            const topic = getTopic.data.res
            dispatch(updateThreadTopic(topic))
          }
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
