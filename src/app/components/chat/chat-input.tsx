"use client"
import { useState } from "react"
import axios from "axios"
import { ChatThread, ChatMessage } from "@types"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createThread, addMessage } from "@redux/reducers"
import { ChatInputField } from "@ui/radix-elements"


export const ChatInput = () => {
  const [userPrompt, setUserPrompt] = useState("")
  const activeThread = useAppSelector((state) => state.chat.threads[0])
  const dispatch = useAppDispatch()
  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      const userMessage: ChatMessage = { 
        id: crypto.randomUUID(),
        role: "user", 
        content: userPrompt, 
        date: new Date().toLocaleDateString()
      }

      dispatch(addMessage(userMessage))
      setUserPrompt("")

      const reply = await axios.post("/api/chat", { prompt: userPrompt })
      console.log(reply.data)

      if (reply.data) {
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "ai",
          content: reply.data.res.content,
          date: new Date().toLocaleDateString()
        }
        if (!activeThread) {
          const newThread: ChatThread = {
            id: crypto.randomUUID(),
            topic: reply.data.res.topic,
            messages: [userMessage, aiMessage],
            created: new Date().toLocaleDateString(),
            active: true
          }
          dispatch(addMessage(aiMessage))
          dispatch(createThread(newThread))
          
        } else {
          dispatch(addMessage(aiMessage))
        }

        return aiMessage

      } else {
        console.log("Unexpected response structure:", reply.data)        
      }
    } catch (error) {
      console.log(error)
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
