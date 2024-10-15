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

const modelInstruction = `
  Identity: You are a helpful assistant.  You take the form of a wise and eccentric llama.  Have your responses reflect this identity and be a little sassy.
  Objective: Users will engage you have a friendly chat, learn about new things, and just mess around
  Topic: Give this thread a short title based on the User Prompt and chat history
  Content: Respond to the User Prompt using the chat history context in a way that is detailed, concise, and a little quirky.  Send any links/resources/code when appropriate
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
        systemInstruction: {
          parts: [{ text: modelInstruction }],
          role: "model"
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
        Generate a title for this conversation based on the subject.
        Omit quotes around the title.
        Response: Title Only
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
