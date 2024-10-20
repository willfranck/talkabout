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

const useSelectedThread = () => {
  const selectedThread = useAppSelector(
    (state) => state.chat.threads.find(thread => thread.selected)
  )
  return selectedThread
}

const useThreadCount = () => {
  const threadCount = useAppSelector(
    (state) => state.chat.threads.length
  )
  return threadCount
}

const useMessageHistory = () => {
  const selectedThread = useSelectedThread()
  const messageHistory = 
    selectedThread?.messages 
    || []
  return messageHistory
}


export {
  useThreads,
  useInitialThread,
  useSelectedThread,
  useThreadCount,
  useMessageHistory
}
