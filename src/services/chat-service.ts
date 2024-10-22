import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai"
import { ChatMessage } from "@types"


const geminiApiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(geminiApiKey!)

const safetyOptions = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
]

const currentTime = `${new Date().toLocaleTimeString(undefined, { timeZoneName: "short" })} - ${new Date().toLocaleDateString(undefined, { weekday: "long" })}, ${new Date().toLocaleDateString()}`

const modelInstruction = `
  Identity: You are a helpful assistant.  You take the form of a wise and eccentric llama.  Have your responses reflect this identity and be a little sassy.
  Objective: Users will engage you have a friendly chat, learn about new things, and just mess around.
  Time Reference: This message was sent at ${currentTime}.
  Content: Respond to the User Prompt using the chat history context in a way that is detailed, concise, and a little quirky.  Send any links/resources/code when appropriate.
`


async function ChatService({
  history,  
  prompt, 
  temperature
}: { 
  history: ChatMessage[],
  prompt: string, 
  temperature: number
}) {
  if (geminiApiKey !== undefined) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "text/plain",
          temperature: temperature
        },
        systemInstruction: {
          parts: [{ text: modelInstruction }],
          role: "model"
        },
        safetySettings: safetyOptions
      })
      
      const userPrompt = prompt
      const chatHistory = Array.isArray(history) 
        ? history.map((message) => ({
          role: message.role,
          parts: [{ text: message.content }]
        })) 
        : []

      const chat = await model.startChat({
        history: chatHistory
      })
      const result = await chat.sendMessage(userPrompt)

      if (result.response) {
        return result.response.text()
      }

    } catch (error) {
      console.log(error)
    }
  }
}


async function ChatTopic({
  history,  
}: { 
  history: ChatMessage[],
}) {
  if (geminiApiKey !== undefined) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "text/plain",
        },
        safetySettings: safetyOptions
      })
      
      const chatHistory = Array.isArray(history) 
        ? history.map((message) => ({
          role: message.role,
          parts: [{ text: message.content }]
        })) 
        : []

      const chat = await model.startChat({
        history: chatHistory
      })
      const result = await chat.sendMessage(`
        Response: Generate a short (roughly 40 chars), accurate, and cheeky title for this conversation based on the topic of the chat history.
        Omit quotes around the title.
      `)

      if (result.response) {
        return result.response.text()
      }

    } catch (error) {
      console.log(error)
    }
  }
}


export {
  ChatService,
  ChatTopic
}
