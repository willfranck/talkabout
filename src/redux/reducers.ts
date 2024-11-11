// Emulating a larger scale app with many slices
import { persistCombineReducers } from "redux-persist"
import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import chatReducer from "@redux/slices/chat"
import userReducer from "@redux/slices/user"

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null)
    },
    setItem() {
      return Promise.resolve()
    },
    removeItem() {
      return Promise.resolve()
    }
  }
}

const storage = typeof window !== "undefined" 
  ? createWebStorage("local")
  : createNoopStorage()

const persistConfig = {
  key: "chat",
  storage: storage
}

const rootReducer = persistCombineReducers(persistConfig, {
  chat: chatReducer,
  user: userReducer
})

export default rootReducer
