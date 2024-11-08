import { useEffect, useRef, useMemo } from "react"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createNewThread, getLastActiveThread } from "@globals/functions"

//// Chat Hooks
const useThreads = () => {
  const threads = useAppSelector(
    (state) => state.chat.threads
  )
  return useMemo(() => threads, [threads])
}

const useThreadCount = () => {
  const threadCount = useAppSelector(
    (state) => state.chat.threads.length
  )
  return useMemo(() => threadCount, [threadCount])
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

  return null
}

const useActiveThreads = () => {
  const threads = useThreads()
  const activeThreads = useMemo(() => 
    threads.filter(thread => thread.category === "active"),
    [threads]
  )
  return activeThreads
}

const useLastActiveThread = () => {
  const activeThreads = useActiveThreads()
  const lastActiveThread = useMemo(() => 
    getLastActiveThread(activeThreads),
    [activeThreads]
  )
  return lastActiveThread
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

const useMessages = () => {
  const messages = useAppSelector(
    (state) => state.chat.messages
  )
  return useMemo(() => messages, [messages])
}

const useThreadMessageHistory = () => {
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
  useLastActiveThread,
  useArchivedThreads,
  useSelectedThread,
  useMessages,
  useThreadMessageHistory
}
