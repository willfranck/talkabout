"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { useAppDispatch } from "@redux/hooks"
import { useUser } from "@hooks/global"
import { temperatureSettings } from "@globals/values"
import { 
  addMessage, 
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
  const threadCount = useThreadCount()
  const selectedThread = useSelectedThread()
  const threadRef = useRef<string | undefined>(undefined)
  const messageHistory = useThreadMessageHistory()
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
      if (user && selectedThread) {
        updateDbThread(user.id, selectedThread, {topic: topic})
      }
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
      if (currentMessages > 0 && currentMessages % 6 === 2) {
        getTopic()
      }
    }
    messagesRef.current = currentMessages
  }, [selectedThread, messageHistory, getTopic])

  const handleSubmit = async () => {
    if (selectedThread) {
      try {
        const userMessage: ChatMessage = { 
          id: crypto.randomUUID(),
          threadId: selectedThread.id,
          role: "user", 
          content: userPrompt, 
          timestamp: new Date().toISOString()
        }
        dispatch(addMessage({ threadId: selectedThread.id, message: userMessage }))
        dispatch(updateLastActive(new Date().toISOString()))
        setUserPrompt("")
        if (user) {
          await saveMessage(user.id, userMessage)
          await updateDbThread(user.id, selectedThread, { last_active: userMessage.timestamp })
        }

        const aiReply = await axios.post("/api/chat", { 
          history: messageHistory, 
          prompt: userPrompt, 
          temperature: aiTemperature 
        })
        if (aiReply.data.res) {
          const content = aiReply.data.res
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            threadId: selectedThread.id,
            role: "model",
            content: content,
            timestamp: new Date().toISOString()
          }
          dispatch(addMessage({ threadId: selectedThread.id, message: aiMessage }))
          if (user) {
            await saveMessage(user.id, aiMessage)
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
      selectedThread={selectedThread}
      temperatureSettings={temperatureSettings}
      defaultTemperature={aiTemperature}
      onTemperatureChange={handleTemperatureChange}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  )
}
