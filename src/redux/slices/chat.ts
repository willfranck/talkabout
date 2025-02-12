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
        thread.selected = false
      })
      state.threads.push({
        ...action.payload,
        selected: true
      })
    },
    deleteThread: (state, action: PayloadAction<string>) => {
      state.threads = state.threads.filter(thread => 
        thread.id !== action.payload
      )
      state.messages = state.messages.filter(message => 
        message.threadId !== action.payload
      )
    },
    updateThreadTopic: (state, action: PayloadAction<string>) => {
      const selectedThread = state.threads.find(thread => thread.selected)
      if (selectedThread) {
        selectedThread.topic = action.payload
      }
    },
    setSelectedThread: (state, action: PayloadAction<string>) => {
      state.threads.forEach(thread => {
        thread.selected = thread.id === action.payload
      })
    },
    updateLastActive: (state, action: PayloadAction<string>) => {
      const selectedThread = state.threads.find(thread => thread.selected)
      if (selectedThread) {
        selectedThread.lastActive = action.payload
      }
    },
    setArchivedThread: (state, action: PayloadAction<string>) => {
      const threadToArchive = state.threads.find(thread => thread.id === action.payload)
      if (threadToArchive) {
        threadToArchive.category = "archived"
        threadToArchive.selected = false
      }
    },
    setRestoreThread: (state, action: PayloadAction<string>) => {
      const threadToRestore = state.threads.find(thread => thread.id === action.payload)
      if (threadToRestore) threadToRestore.category = "active"
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    deleteMessages: (state, action: PayloadAction<string>) => {
      const messageToDelete = state.messages.find(message => message.id === action.payload)
      if (!messageToDelete) return

      const messageIndex = state.messages.findIndex(message => message.id === action.payload)
      state.messages = state.messages.filter((message, index) => 
        message.threadId !== messageToDelete.threadId
        || (message.threadId === messageToDelete.threadId && index < messageIndex)
      )
    },
    clearChats: (state) => {
      state.threads = []
      state.messages = []
    },
  }
})

export const {
  createThread, 
  deleteThread, 
  updateThreadTopic,
  setSelectedThread,
  updateLastActive, 
  setArchivedThread,
  setRestoreThread,
  addMessage,
  deleteMessages, 
  clearChats
} = chatSlice.actions

export default chatSlice.reducer
