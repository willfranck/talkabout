import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ChatMessage } from "@types"

interface ChatState {
  messages: ChatMessage[]
}

const initialState: ChatState = {
  messages: []
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    }
  }
})

export const {
  addMessage,
  clearMessages
} = chatSlice.actions

export default chatSlice.reducer
