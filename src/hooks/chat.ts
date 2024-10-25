import { useEffect, useRef, useMemo } from "react"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createNewThread } from "@globals/functions"

//// Chat Hooks
const useThreads = () => {
  const threads = useAppSelector(
    (state) => state.chat.threads
  )
  return threads
}

const useThreadCount = () => {
  const threadCount = useAppSelector(
    (state) => state.chat.threads.length
  )
  return threadCount
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
  }, [dispatch, threads.length])
}

const useActiveThreads = () => {
  const threads = useThreads()
  const activeThreads = useMemo(() => 
    threads.filter(thread => thread.category === "active"),
    [threads]
  )
  return activeThreads
}

const useArchivedThreads = () => {
  const threads = useThreads()
  const archivedThreads = useMemo(() => 
    threads.filter(thread => thread.category === "archived"),
    [threads]
  )
  return archivedThreads
}

const useSelectedThread = () => {
  const selectedThread = useAppSelector(
    (state) => state.chat.threads.find(thread => thread.selected)
  )
  return selectedThread
}

const useMessageHistory = () => {
  const selectedThread = useSelectedThread()
  const messageHistory = useMemo(() =>
    selectedThread?.messages || [],
    [selectedThread]
  )
  return messageHistory
}


export {
  useThreads,
  useThreadCount,
  useInitialThread,
  useActiveThreads,
  useArchivedThreads,
  useSelectedThread,
  useMessageHistory
}
