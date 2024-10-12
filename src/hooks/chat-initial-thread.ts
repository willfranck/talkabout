import { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createNewThread } from "@globals/functions"

export const useInitialThread = () => {
  const dispatch = useAppDispatch()
  const threads = useAppSelector((state) => state.chat.threads)
  const threadCreated = useRef(false)

  useEffect(() => {
    if (threads.length === 0 && !threadCreated.current) {
      createNewThread(dispatch)
      threadCreated.current = true
    }
  }, [dispatch, threads])
}
