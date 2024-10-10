"use client"
import { useState } from "react"
import axios from "axios"
import { ChatMessage } from "@types"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { addMessage, updateThreadTopic } from "@redux/reducers"
import { ChatInputField } from "@ui/radix-elements"


export const ChatInput = () => {
  const [userPrompt, setUserPrompt] = useState("")
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
          date: new Date().toLocaleDateString()
        }
        setUserPrompt("")
        dispatch(addMessage(userMessage))

        const reply = await axios.post("/api/chat", { prompt: userPrompt })
        if (reply.data) {
          const { topic, content } = reply.data.res
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "ai",
            content: content,
            date: new Date().toLocaleDateString()
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
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  )
}
