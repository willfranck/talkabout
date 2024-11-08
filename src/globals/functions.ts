import { AppDispatch } from "@redux/store"
import { 
  ChatThread,
  transformSupabaseThread,
  transformSupabaseMessage,
  ChatMessage
 } from "@types"
import { 
  createThread, 
  deleteThread, 
  setSelectedThread,
  setArchivedThread, 
  setRestoreThread,
  addMessage,
  deleteMessages,
  clearAllThreads
} from "@redux/slices/chat"
import { getAllMessages } from "@services/supabase-actions"
import { randomTopic } from "@globals/values"

//// Redux Functions
type Action =
  | { type: "chat/createThread", payload: ChatThread }
  | { type: "chat/addMessage", payload: { threadId: string, message: ChatMessage } }

const syncDbMessages = async (userId: string, threads: ChatThread[], messages: ChatMessage[]) => {
  try {
    const reduxActions: Action[] = []
    const data = await getAllMessages(userId)

    const threadMap = new Map(threads.map(thread => [thread.id, thread]))
    const messageMap = new Map(messages.map(message => [message.id, message]))

    if (data.success && data.chatThreads) {
      const transformedThreads = data.chatThreads.map(transformSupabaseThread)
      for (const chatThread of transformedThreads) {
        if (!threadMap.has(chatThread.id)) {
          reduxActions.push(createThread(chatThread))
        }
      }
    }
    if (data.chatMessages) {
      const transformedMessages = data.chatMessages.map(transformSupabaseMessage)
      for (const chatMessage of transformedMessages) {
        if (!messageMap.has(chatMessage.id)) {
          reduxActions.push(addMessage({ threadId: chatMessage.threadId, message: chatMessage }))
        }
      }
    }
    return reduxActions
  } catch (error) {
    return []
  }
}

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

//// Debounce Function
function debounce(key: string, delay: number) {
  const now = Date.now()
  const prev = localStorage.getItem(key)
    ? parseInt(localStorage.getItem(key) as string)
    : 0
  
  if (now - prev < delay) {
    return true
  }
  localStorage.setItem(key, now.toString())
  return false
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
  syncDbMessages,
  createNewThread,
  removeThread,
  selectThread,
  getLastActiveThread,
  archiveThread,
  restoreThread,
  deleteMessage,
  clearAll,
  debounce,
  displayTextByChar,
  removeTextByChar
}
