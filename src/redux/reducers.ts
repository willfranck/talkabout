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
    setActiveThread: (state, action: PayloadAction<string>) => {
      state.threads.forEach(thread => {
        thread.active = thread.id === action.payload
      })
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    }
  }
})

export const {
  createThread,
  setActiveThread,
  addMessage,
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
