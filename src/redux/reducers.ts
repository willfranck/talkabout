// Emulating a larger scale app with many slices
import { combineReducers } from "@reduxjs/toolkit"
import chatReducer from "@redux/slices/chat"

const rootReducer = combineReducers({
  chat: chatReducer,
})

export default rootReducer
