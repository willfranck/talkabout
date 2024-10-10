import { AppDispatch } from "@redux/store"
import { createThread, setActiveThread } from "@redux/reducers"
import { ChatThread } from "@types"
import { randomTopic } from "@globals/values"


export function createNewThread(dispatch: AppDispatch) {
  const newThread: ChatThread = {
    id: crypto.randomUUID(),
    topic: randomTopic(),
    messages: [],
    created: new Date().toLocaleDateString(),
    active: true,
  }
  dispatch(createThread(newThread))
}

export function selectActiveThread(dispatch: AppDispatch, threadId: string) {
  dispatch(setActiveThread(threadId))
}
