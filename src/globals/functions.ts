import { AppDispatch } from "@redux/store"
import { createThread, setActiveThread } from "@redux/reducers"
import { ChatThread } from "@types"
import { randomTopic } from "@globals/values"

//// Redux Functions ////
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

//// UI Functions ////
export function displayTextByChar(text: string, setState: React.Dispatch<React.SetStateAction<string>>) {
  let accumulatedText = ""
  text.split("").forEach((char, index) => {
    setTimeout(() => {
      accumulatedText += char
      setState(accumulatedText)
    }, index * 18)
  })
}

export function removeTextByChar(text: string, setState: React.Dispatch<React.SetStateAction<string>>) {
  const textLength = text.length;

  text.split("").forEach((_, index) => {
    setTimeout(() => {
      const remainingText = text.slice(0, textLength - index - 1); // Slice off one more character each time
      setState(remainingText);
    }, index * 12); // Delay for removing characters (adjust time as needed)
  })
}