"use client"
import { useState } from "react"
import axios from "axios"
import { 
  useAppSelector, 
  useAppDispatch 
} from "@redux/hooks"
import { 
  addMessage, 
  updateThreadTopic 
} from "@redux/reducers"
import { ChatMessage } from "@types"
import { ChatInputField } from "@ui/chat-elements"


export const ChatInput = () => {
  const [userPrompt, setUserPrompt] = useState("")
  const threadCount = useAppSelector((state) => state.chat.threads.length)
  const activeThread = useAppSelector((state) => state.chat.threads.find(thread => thread.active))
  const dispatch = useAppDispatch()
  
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

        const reply = await axios.post("/api/chat", { prompt: userPrompt, temperature: 2.0 })
        if (reply.data) {
          const { topic, content } = reply.data.res
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "ai",
            content: content,
            date: new Date().toISOString()
          }
          dispatch(addMessage(aiMessage)) 
          dispatch(updateThreadTopic(topic))
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
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  )
}
