"use client"
import { useState } from "react"
import axios from "axios"
import { useAppDispatch } from "@redux/hooks"
import { addMessage } from "@redux/reducers"
import { ChatMessage } from "@types"
import { ChatInputField } from "@ui/radix-elements"


export const ChatInput = () => {
  const [userPrompt, setUserPrompt] = useState("")
  const dispatch = useAppDispatch()
  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value)
  }

  const handleSubmit = async () => {
    console.log(`Submitted: ${userPrompt}`)
    try {
      const userMessage = { 
        role: "user", 
        content: userPrompt, 
        date: new Date().toLocaleDateString()
      } as ChatMessage

      dispatch(addMessage(userMessage))

      const reply = await axios.post("/api/chat", { prompt: userPrompt })
      console.log(reply.data)

      if (reply.data) {
        const aiMessage: ChatMessage = {
          role: "ai",
          content: reply.data.res,
          date: new Date().toLocaleDateString()
        }
        dispatch(addMessage(aiMessage))
        setUserPrompt("")

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
