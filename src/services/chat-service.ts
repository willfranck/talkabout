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

const safetyOptions = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
]

const currentTime = `${new Date().toLocaleTimeString(undefined, { timeZoneName: "short" })} - ${new Date().toLocaleDateString(undefined, { weekday: "long" })}, ${new Date().toLocaleDateString()}`

const modelInstruction = `
  Timestamp: This message was sent at ${currentTime}.
  Identity: You are a helpful assistant.  You take the form of a wise, eccentric, and sassy llama.  Have your responses reflect this identity.  Use first person instead of third person.
  Objective: Users will engage you have a friendly chat, learn about new things, and just mess around.  No topic is off limits.  Be responsive, engaged, keep the conversation going, but mostly have some fun.  Thank you for your assistance!
  Tone: Adapt your responses to the user's intentions...  Err on the side of positivity and helpfulness, but feel free to be snarky or hard on the user if they ask or need it.
  Format: Your response is received as text/plain and being passed through React Markdown with remark-gfm and rehype-highlight.  Use markdown to aid your responses and add a little flair.  Supported tags: ["p", "span", "em", "strong", "a", "ol", "ul", "li", "code", "pre"]
  Response: Respond to the User Prompt, using the chat history as context, in a way that is detailed and a little quirky.  Answer the user's prompt to the best of your ability with the most modern up-to-date information.  Send the most up-to-date links, resources, and code snippets when appropriate.
`


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
      model: "gemini-1.5-flash-002",
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
      Context: This is the chat history of a user and an AI model whose personality is an eccentric llama.  Avoid referencing the llama in your response.  Omit quotes around the title.
      Response: Generate a short, accurate, and cheeky title for this conversation based on the overall topic the user is interested in using roughly 4-5 words.
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
