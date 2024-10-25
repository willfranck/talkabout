import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ChatThread, ChatMessage } from "@types"
import { getLastActiveThread } from "@globals/functions"

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
      const wasDeletedThreadSelected = state.threads.some(thread => thread.id === action.payload && thread.selected)
      state.threads = state.threads.filter(thread => 
        thread.id !== action.payload
      )
      const activeThreads = state.threads.filter(thread => thread.category === "active")
      const lastActiveThread = getLastActiveThread(activeThreads, wasDeletedThreadSelected)
      if (lastActiveThread) {
        state.threads.forEach(thread => {
          thread.selected = thread.id === lastActiveThread
        })
      }
    },
    updateThreadTopic: (state, action: PayloadAction<string>) => {
      const selectedThread = state.threads.find(thread => thread.selected)
      if (selectedThread) {
        selectedThread.topic = action.payload
      }
    },
    setActiveThread: (state, action: PayloadAction<string>) => {
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
        threadToArchive.selected = false
        threadToArchive.category = "archived"
      }
      const activeThreads = state.threads.filter(thread => thread.category === "active")
      if (activeThreads.length > 0) {
        const lastActiveThread = activeThreads.reduce((latest, current) => {
          return current.lastActive > latest.lastActive ? current : latest
        }, state.threads[0])
        if (lastActiveThread && lastActiveThread.lastActive !== "") {
          state.threads.forEach(thread => {
            thread.selected = thread.id === lastActiveThread.id
          })
        } else {
          const lastCreatedThread = activeThreads.reduce((latest, current) => {
            return current.created > latest.created ? current : latest
          })
          state.threads.forEach(thread => {
            thread.selected = thread.id === lastCreatedThread.id
          })
        }
      }
    },
    setRestoreThread: (state, action: PayloadAction<string>) => {
      const threadToRestore = state.threads.find(thread => thread.id === action.payload)
      if (threadToRestore) threadToRestore.category = "active"
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const selectedThread = state.threads.find(thread => thread.selected)
      if (selectedThread) {
        selectedThread.messages.push(action.payload)
      }
    },
    deleteMessages: (state, action: PayloadAction<string>) => {
      const selectedThread = state.threads.find(thread => thread.selected)
      if (selectedThread) {
        const messageIndex = selectedThread.messages.findIndex(message => message.id === action.payload)
        if (messageIndex !== -1) {
          selectedThread.messages = selectedThread.messages.slice(0, messageIndex)
        }
      }
    },
    clearMessages: (state) => {
      const selectedThread = state.threads.find(thread => thread.selected)
      if (selectedThread) {
        selectedThread.messages = []
      }
    },
  }
})

export const {
  createThread, 
  deleteThread, 
  updateThreadTopic,
  setActiveThread,
  updateLastActive, 
  setArchivedThread,
  setRestoreThread,
  addMessage,
  deleteMessages, 
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
