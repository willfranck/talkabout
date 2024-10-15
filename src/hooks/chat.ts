import { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createNewThread } from "@globals/functions"

//// Chat Hooks
const useThreads = () => {
  const threads = useAppSelector(
    (state) => state.chat.threads
  )
  return threads
}

const useInitialThread = () => {
  const dispatch = useAppDispatch()
  const threads = useThreads()
  const threadCreated = useRef(false)

  useEffect(() => {
    if (threads.length === 0 && !threadCreated.current) {
      createNewThread(dispatch)
      threadCreated.current = true
    }
  }, [dispatch, threads])
}

const useActiveThread = () => {
  const activeThread = useAppSelector(
    (state) => state.chat.threads.find(thread => thread.active)
  )
  return activeThread
}

const useThreadCount = () => {
  const threadCount = useAppSelector(
    (state) => state.chat.threads.length
  )
  return threadCount
}

const useMessageHistory = () => {
  const activeThread = useActiveThread()
  const messageHistory = 
    activeThread?.messages 
    || []
  return messageHistory
}


export {
  useThreads,
  useInitialThread,
  useActiveThread,
  useThreadCount,
  useMessageHistory
}
