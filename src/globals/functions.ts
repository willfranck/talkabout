import { AppDispatch } from "@redux/store"
import { 
  createThread, 
  deleteThread, 
  setSelectedThread,
  setArchivedThread, 
  setRestoreThread,
  deleteMessages,
  clearAllThreads
} from "@redux/slices/chat"
import { ChatThread } from "@types"
import { randomTopic } from "@globals/values"

//// Redux Functions
function createNewThread(dispatch: AppDispatch) {
  const newThread: ChatThread = {
    id: crypto.randomUUID(),
    topic: randomTopic(),
    messages: [],
    category: "active",
    created: new Date().toISOString(),
    selected: true,
    lastActive: new Date().toISOString()
  }
  dispatch(createThread(newThread))
  return newThread
}

function selectThread(dispatch: AppDispatch, threadId: string) {
  dispatch(setSelectedThread(threadId))
}

function getLastActiveThread(activeThreads: ChatThread[]) {
  if (activeThreads.length === 0) return null

  const lastActiveThread = activeThreads.reduce((latest, current) => {
    return current.lastActive > latest.lastActive ? current : latest
  }, activeThreads[0])

  if (lastActiveThread && lastActiveThread.messages.length > 0) {
    return lastActiveThread.id
  } else {
    const lastCreatedThread = activeThreads.reduce((latest, current) => {
      return current.created > latest.created ? current : latest
    })
    return lastCreatedThread.id
  }
}

function archiveThread(dispatch: AppDispatch, threadId: string) {
  dispatch(setArchivedThread(threadId))
}

function restoreThread(dispatch: AppDispatch, threadId: string) {
  dispatch(setRestoreThread(threadId))
}

function removeThread(dispatch: AppDispatch, threadId: string) {
  dispatch(deleteThread(threadId))
}

function deleteMessage(dispatch: AppDispatch, messageId: string) {
  dispatch(deleteMessages(messageId))
}

function clearAll(dispatch: AppDispatch) {
  dispatch(clearAllThreads())
}

//// UI Functions
function displayTextByChar(text: string, setState: React.Dispatch<React.SetStateAction<string>>) {
  let accumulatedText = ""
  text.split("").forEach((char, index) => {
    setTimeout(() => {
      accumulatedText += char
      setState(accumulatedText)
    }, index * 18)
  })
}

function removeTextByChar(text: string, setState: React.Dispatch<React.SetStateAction<string>>) {
  const textLength = text.length
  text.split("").forEach((_, index) => {
    setTimeout(() => {
      const remainingText = text.slice(0, textLength - index - 1)
      setState(remainingText)
    }, index * 12)
  })
}


export {
  createNewThread,
  removeThread,
  selectThread,
  getLastActiveThread,
  archiveThread,
  restoreThread,
  deleteMessage,
  clearAll,
  displayTextByChar,
  removeTextByChar
}
