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
      state.threads = state.threads.filter(thread => thread.id !== action.payload)
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
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        activeThread.messages.push(action.payload)
      }
    },
    clearMessages: (state) => {
      const activeThread = state.threads.find(thread => thread.active)
      if (activeThread) {
        activeThread.messages = []
      }
    }
  }
})

export const {
  createThread, 
  deleteThread, 
  updateThreadTopic,
  setActiveThread,
  addMessage,
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
