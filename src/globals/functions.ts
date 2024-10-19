import { AppDispatch } from "@redux/store"
import { 
  createThread, 
  archiveThread,
  deleteThread, 
  setActiveThread, 
  deleteMessages
} from "@redux/reducers"
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
    active: true,
    lastActive: ""
  }
  dispatch(createThread(newThread))
}

function archiveChat(dispatch: AppDispatch, threadId: string) {
  dispatch(archiveThread(threadId))
}

function removeThread(dispatch: AppDispatch, threadId: string) {
  dispatch(deleteThread(threadId))
}

function selectActiveThread(dispatch: AppDispatch, threadId: string) {
  dispatch(setActiveThread(threadId))
}

function deleteMessage(dispatch: AppDispatch, messageId: string) {
  dispatch(deleteMessages(messageId))
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
  archiveChat,
  removeThread,
  selectActiveThread,
  deleteMessage,
  displayTextByChar,
  removeTextByChar
}
