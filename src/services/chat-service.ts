import {
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
  GoogleGenerativeAIFetchError,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai"
import { ChatMessage, ChatRes } from "@types"


const geminiApiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(geminiApiKey!)

// Simplified safety settings - only keep essential ones
const safetyOptions = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

const currentTime = `${new Date().toLocaleTimeString(undefined, { timeZoneName: "short" })} - ${new Date().toLocaleDateString(undefined, { weekday: "long" })}, ${new Date().toLocaleDateString()}`

const modelInstruction = `
  You are a wise, eccentric, and sassy llama assistant. Be helpful, engaging, and fun. Use first person. 
  Respond with markdown and/or code blocks when helpful and to add flair. Supported tags: ["p", "span", "em", "strong", "a", "ol", "ul", "li", "code", "pre"]. 
  Current time and date: ${currentTime}.
`

const limitChatHistory = (history: ChatMessage[], maxMessages: number = 20) => {
  if (history.length <= maxMessages) return history
  return history.slice(-maxMessages)
}

async function ChatService({
  history,  
  prompt, 
  temperature
}: { 
  history: ChatMessage[],
  prompt: string, 
  temperature: number
}): Promise<ChatRes> {
  if (!geminiApiKey) {
    return {
      success: false,
      error: { message: "API Key not found/valid" }
    }
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        responseMimeType: "text/plain",
        temperature: temperature,
        topK: temperature > 1.0 ? 40 : 20,
        topP: temperature > 1.0 ? 0.9 : 0.8,
        candidateCount: 1
      },
      systemInstruction: {
        role: "model",
        parts: [{ text: modelInstruction }]
      },
      safetySettings: safetyOptions
    })
    
    const limitedHistory = limitChatHistory(history)
    const chatHistory = Array.isArray(limitedHistory) 
      ? limitedHistory.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }]
      })) 
      : []

    const chat = await model.startChat({
      history: chatHistory
    })

    const userPrompt = prompt
    const result = await chat.sendMessage(userPrompt)

    if (result.response) {
      return { 
        success: true, 
        content: result.response.text()
      }
    } else {
      return { 
        success: false, 
        error: { message: "No content was received" }
      }
    }

  } catch (error) {
    if (error instanceof GoogleGenerativeAIError) {
      return { 
        success: false, 
        error: { 
          message: error.message,
          cause: error.cause
        }
      }
    } else if (error instanceof GoogleGenerativeAIFetchError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.status
        }
      }
    }
  }
  return { 
    success: false, 
    error: { message: "An undefined error occurred" }
  }
}


async function ChatTopic({
  history,  
}: { 
  history: ChatMessage[],
}): Promise<ChatRes> {
  if (!geminiApiKey) {
    return {
      success: false,
      error: { message: "API Key not found/valid" }
    }
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-002",
      generationConfig: {
        responseMimeType: "text/plain",
        temperature: 1.2,
        topK: 20,
        topP: 0.7,
        candidateCount: 1
      },
      safetySettings: safetyOptions
    })
    
    const limitedHistory = limitChatHistory(history)
    const chatHistory = Array.isArray(limitedHistory) 
      ? limitedHistory.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }]
      })) 
      : []
      
    const chat = await model.startChat({
      history: chatHistory
    })
    const result = await chat.sendMessage(`
      Generate a short, cheeky title (4-5 words) for this conversation based on the chat history. Don't reference yourself, the AI, or the llama. No quotes.
    `)

    if (result.response) {
      return { 
        success: true, 
        content: result.response.text()
      }
    } else {
      return { 
        success: false, 
        error: { message: "No content was received" }
      }
    }

  } catch (error) {
    if (error instanceof GoogleGenerativeAIError) {
      return { 
        success: false, 
        error: { 
          message: error.message,
          cause: error.cause
        }
      }
    } else if (error instanceof GoogleGenerativeAIFetchError) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.status
        }
      }
    }
  }
  return { 
    success: false, 
    error: { message: "An undefined error occurred" }
  }
}


export {
  ChatService,
  ChatTopic
}
