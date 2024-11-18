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
import { ChatMessage, ChatRes } from "@types"
import { ChatInputField } from "@chat/chat-elements"

type ChatError = NonNullable<ChatRes["error"]>

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
    const aiReply = await axios.post("/api/chat-topic", { history: messages })
    if (aiReply.data.error) {
      showMessage("info", "Couldn't update the thread topic at this time\nC'est la vie", 3000)
    }
    if (aiReply.data.content) {
      const topic = aiReply.data.content
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

      try {
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

        if (aiReply.data.error) {
          throw new Error(aiReply.data.error)
        }

        if (aiReply.data.content) {
          const content = aiReply.data.content
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
          if (chatHistory.length % 6 === 2) {
            const setGetTopic = setTimeout(() => {
              getTopic(chatHistory)
            }, 480)
            return () => clearTimeout(setGetTopic)
          }
        }
      } catch (error) {
        dispatch(deleteMessages(userMessage.id))

        const status = axios.isAxiosError(error) ? error.response?.status : undefined
        const getErrorMessage = (status?: number) => {
          switch (status) {
            case 503:
              return "The AI service responded as unavailable\nProbably wandered off grazing on alfalfa\n\nPlease try your query again shortly"
            case 429:
              return "The AI's server is overwhelmed\nToo many requests for the best hay perhaps\n\nPlease try your query again shortly"
            default:
              return status
                ? `Something went wrong with code: ${status}\n\nPlease try your query again`
                : "Something unexplainable went wrong\n\nPlease try your query again"
          }
        }
        const errorMessage = getErrorMessage(status)
        showMessage("error", errorMessage, 6000)
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
