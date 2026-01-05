import { AppDispatch } from "@redux/store"
import { 
  ChatThread,
  ChatMessage,
  transformSupabaseThread,
  transformSupabaseMessage,
  ReduxActions
 } from "@types"
import { 
  createThread, 
  deleteThread, 
  setSelectedThread,
  setArchivedThread, 
  setRestoreThread,
  addMessage,
  deleteMessages,
  clearChats
} from "@redux/slices/chat"
import { 
  getAllMessages, 
  saveThread, 
  saveMessage 
} from "@services/supabase-actions"
import { randomTopic } from "@globals/values"

//// Utility Functions
const retry = async <T>(
  fn: () => Promise<T>,
  attempts: number,
  delay: number
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (attempts === 1) throw error
    await new Promise(resolve => setTimeout(resolve, delay))
    return retry(fn, attempts - 1, delay)
  }
}

const chunk = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  )
}

const generateID = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for non-secure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

//// Redux Functions
interface SyncResult {
  actions: ReduxActions[]
  errors: Error[]
  stats: {
    threadsAddedLocal: number
    msgsAddedLocal: number
    threadsSavedToDb: number
    msgsSavedToDb: number
  }
}

const syncDbMessages = async (
  userId: string, 
  threads: ChatThread[], 
  messages: ChatMessage[],
  options = {
    batchSize: 50,
    retryAttempts: 3,
    retryDelay: 1000
  }
): Promise<SyncResult> => {
  const reduxActions: ReduxActions[] = []
  const errors: Error[] = []
  const stats = {
    threadsAddedLocal: 0,
    msgsAddedLocal: 0,
    threadsSavedToDb: 0,
    msgsSavedToDb: 0
  }

  try {
    // Create Maps of existing threads/messages
    const threadMap = new Map(threads.map(thread => [thread.id, thread]))
    const messageMap = new Map(messages.map(message => [message.id, message]))

    const data = await retry(
      () => getAllMessages(userId),
      options.retryAttempts,
      options.retryDelay
    )

    if (!data.success) throw new Error("Failed fetching DB messages after retries")
    
    // Create Maps of incoming DB threads/messages
    const dbThreadMap = new Map(data.chatThreads?.map(thread => [thread.id, thread]) || [])
    const dbMessageMap = new Map(data.chatMessages?.map(message => [message.id, message]) || [])
    
    // Iterate through maps in batches
    if (data.chatThreads) {
      const transformedThreads = data.chatThreads.map(transformSupabaseThread)
      for (const batch of chunk(transformedThreads, options.batchSize)) {
        await Promise.all(batch.map(async chatThread => {
          try {
            if (!threadMap.has(chatThread.id)) {
              reduxActions.push(createThread(chatThread))
              stats.threadsAddedLocal++
            }
          } catch (error) {
            errors.push(new Error(`Failed to add thread ${chatThread.id}: Error: ${error}`))
          }
        }))
      }
    }
    if (data.chatMessages) {
      const transformedMessages = data.chatMessages.map(transformSupabaseMessage)
      for (const batch of chunk(transformedMessages, options.batchSize)) {
        await Promise.all(batch.map(async chatMessage => {
          try {
            if (!messageMap.has(chatMessage.id)) {
              reduxActions.push(addMessage(chatMessage))
              stats.msgsAddedLocal++
            }
          } catch (error) {
            errors.push(new Error(`Failed to add message ${chatMessage.id}: Error: ${error}`))
          }
        }))
      }
    }

    // Sync any unsaved local threads/messages
    for (const batch of chunk(threads, options.batchSize)) {
      await Promise.all(batch.map(async thread => {
        if (!dbThreadMap.has(thread.id)) {
          await saveThread(userId, thread)
          stats.threadsSavedToDb++
        }
      }))
    }
    for (const batch of chunk(messages, options.batchSize)) {
      await Promise.all(batch.map(async message => {
        if (!dbMessageMap.has(message.id)) {
          await saveMessage(userId, message)
          stats.msgsSavedToDb++
        }
      }))
    }

    return { actions: reduxActions, errors, stats }

  } catch (error) {
    errors.push(error as Error)
    return { actions: [], errors, stats }
  }
}

function createNewThread(dispatch: AppDispatch) {
  const newThread: ChatThread = {
    id: generateID(),
    topic: randomTopic(),
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

function getLastActiveThread(activeThreads: ChatThread[], messages: ChatMessage[]) {
  if (activeThreads.length === 0) return null

  const lastActiveThread = activeThreads.reduce((latest, current) => {
    return current.lastActive > latest.lastActive ? current : latest
  }, activeThreads[0])

  const lastActiveThreadMessages = messages.filter(msg => msg.threadId === lastActiveThread.id)
  if (lastActiveThread && lastActiveThreadMessages.length > 0) {
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

function clearChatStore(dispatch: AppDispatch) {
  dispatch(clearChats())
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
  generateID,
  createNewThread,
  removeThread,
  selectThread,
  getLastActiveThread,
  archiveThread,
  restoreThread,
  deleteMessage,
  clearChatStore,
  debounce,
  displayTextByChar,
  removeTextByChar
}
