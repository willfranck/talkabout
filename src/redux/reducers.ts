import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ChatThread, ChatMessage } from "@types"

interface ChatState {
  threads: ChatThread[]
  messages: ChatMessage[]
}

const initialState: ChatState = {
  threads: [],
  messages: []
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createThread: (state, action: PayloadAction<ChatThread>) => {
      state.threads.forEach(thread => {
        thread.active = false
      })
      state.threads.push({
        ...action.payload,
        active: true
      })
    },
    deleteThread: (state, action: PayloadAction<string>) => {
      const wasDeletedThreadActive = state.threads.some(thread => thread.id === action.payload && thread.active)
      state.threads = state.threads.filter(thread => 
        thread.id !== action.payload
      )
      if (wasDeletedThreadActive && state.threads.length > 0) {
        const lastActiveThread = state.threads.reduce((latest, current) => {
          return current.lastActive > latest.lastActive ? current : latest
        })
        if (lastActiveThread) {
          state.threads.forEach(thread => {
            thread.active = thread.id === lastActiveThread.id
          })
        }
      }
    },
    updateThreadTopic: (state, action: PayloadAction<string>) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        activeThread.topic = action.payload
      }
    },
    setActiveThread: (state, action: PayloadAction<string>) => {
      state.threads.forEach(thread => {
        thread.active = thread.id === action.payload
      })
    },
    updateLastActive: (state, action: PayloadAction<string>) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        activeThread.lastActive = action.payload
      }
    },
    archiveThread: (state, action: PayloadAction<string>) => {
      const threadToArchive = state.threads.find(thread => thread.id === action.payload)
      if (threadToArchive) {
        threadToArchive.category = "archived"
        if (threadToArchive.active && state.threads.length > 0) {
          threadToArchive.active = false
          const lastActiveThread = state.threads.reduce((latest, current) => {
            return current.lastActive > latest.lastActive ? current : latest
          })
          if (lastActiveThread) {
            state.threads.forEach(thread => {
              thread.active = thread.id === lastActiveThread.id;
            })
          }
        }
      }
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        activeThread.messages.push(action.payload)
      }
    },
    deleteMessages: (state, action: PayloadAction<string>) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        const messageIndex = activeThread.messages.findIndex(message => message.id === action.payload)
        if (messageIndex !== -1) {
          activeThread.messages = activeThread.messages.slice(0, messageIndex)
        }
      }
    },
    clearMessages: (state) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        activeThread.messages = []
      }
    },
  }
})

export const {
  createThread, 
  archiveThread,
  deleteThread, 
  updateThreadTopic,
  setActiveThread,
  updateLastActive, 
  addMessage,
  deleteMessages, 
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
