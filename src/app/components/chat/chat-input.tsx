"use client"
import { useState } from "react"
import axios from "axios"
import { useAppDispatch } from "@redux/hooks"
import { useUser, useSnackbar } from "@hooks/global"
import { temperatureSettings } from "@globals/values"
import { 
  addMessage, 
  deleteMessages, 
  updateLastActive, 
  updateThreadTopic 
} from "@redux/slices/chat"
import { 
  saveMessage,
  updateDbThread
} from "@services/supabase-actions"
import { 
  useThreadCount, 
  useSelectedThread, 
  useThreadMessageHistory 
} from "@hooks/chat"
import { ChatMessage } from "@types"
import { ChatInputField } from "@ui/chat-elements"


export const ChatInput = () => {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const { showMessage } = useSnackbar()
  const threadCount = useThreadCount()
  const selectedThread = useSelectedThread()
  const messageHistory = useThreadMessageHistory()
  const [userPrompt, setUserPrompt] = useState("")
  const [aiTemperature, setAiTemperature] = useState(temperatureSettings.hot)

  const handleTemperatureChange = (value: number) => {
    setAiTemperature(value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value)
  }

  const getTopic = async (messages: ChatMessage[]) => {
    const reply = await axios.post("/api/chat-topic", { history: messages })
    if (reply.data.res) {
      const topic = reply.data.res
      dispatch(updateThreadTopic(topic))
      
      if (user && selectedThread) {
        updateDbThread(user.id, selectedThread, {topic: topic})
      }
    }
  }

  const handleSubmit = async () => {
    if (selectedThread) {
      const userMessage: ChatMessage = { 
        id: crypto.randomUUID(),
        threadId: selectedThread.id,
        role: "user", 
        content: userPrompt, 
        timestamp: new Date().toISOString()
      }
      dispatch(addMessage(userMessage))
      dispatch(updateLastActive(new Date().toISOString()))
      setUserPrompt("")
      
      try {
        const loadingMessage: ChatMessage = {
          id: "0",
          threadId: selectedThread.id,
          role: "model",
          content: "Reticulating splines...",
          timestamp: new Date().toISOString()
        }
        const setLoadingMsg = setTimeout(() => {
          dispatch(addMessage(loadingMessage))
        }, 480)

        if (user) {
          await saveMessage(user.id, userMessage)
          await updateDbThread(
            user.id, 
            selectedThread, 
            { last_active: userMessage.timestamp }
          )
        }

        const aiReply = await axios.post("/api/chat", { 
          history: messageHistory, 
          prompt: userPrompt, 
          temperature: aiTemperature 
        })

        const removeLoadingMessage = () => {
          dispatch(deleteMessages(loadingMessage.id))
          return () => clearTimeout(setLoadingMsg)
        }
        removeLoadingMessage()
        
        if (aiReply.data.res) {
          const content = aiReply.data.res
          console.log(content)
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            threadId: selectedThread.id,
            role: "model",
            content: content,
            timestamp: new Date().toISOString()
          }
          dispatch(addMessage(aiMessage))
          if (user) {
            await saveMessage(user.id, aiMessage)
          }

          const chatHistory = [
            ...messageHistory, 
            userMessage, 
            aiMessage
          ]
          if (chatHistory.length % 4 === 2) {
            const setGetTopic = setTimeout(() => {
              getTopic(chatHistory)
            }, 480)
            return () => clearTimeout(setGetTopic)
          }
        }
      } catch (error) {
        console.log(error)
        dispatch(deleteMessages(userMessage.id))
        showMessage("error", "Something went wrong with that response\nPlease try your query again", 6000)
      }
    }
  }

  return (
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
  )
}
