import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@redux/hooks"
import { createNewThread } from "@globals/functions"

let threadCreated = false


export const useInitialThread = () => {
  const dispatch = useAppDispatch()
  const threads = useAppSelector((state) => state.chat.threads)

  useEffect(() => {
    if (threads.length === 0 && !threadCreated) {
      createNewThread(dispatch)
      threadCreated = true
    }
  }, [dispatch, threads])
}
