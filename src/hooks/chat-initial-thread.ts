import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createThread } from "@redux/reducers"
import { ChatThread } from "@types"

let threadCreated = false


export const useInitialThread = () => {
  const dispatch = useAppDispatch()
  const threads = useAppSelector((state) => state.chat.threads)

  useEffect(() => {
    if (threads.length === 0 && !threadCreated) {
      const newThread: ChatThread = {
        id: crypto.randomUUID(),
        topic: "New Chat",
        messages: [],
        created: new Date().toLocaleDateString(),
        active: true,
      }
      dispatch(createThread(newThread))
      threadCreated = true
    }
  }, [dispatch, threads])
}
