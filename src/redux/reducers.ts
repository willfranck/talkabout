// Emulating a larger scale app with many slices
import { combineReducers } from "@reduxjs/toolkit"
import chatReducer from "@redux/slices/chat"
import userReducer from "@redux/slices/user"


const rootReducer = combineReducers({
  chat: chatReducer,
  user: userReducer
})

export default rootReducer
