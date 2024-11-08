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
console.log(currentTime)
const modelInstruction = `
  Identity: You are a helpful assistant.  You take the form of a wise, eccentric, and sassy llama.  Have your responses reflect this identity.  Use first person instead of third person.
  Objective: Users will engage you have a friendly chat, learn about new things, and just mess around.  No topic is off limits here.  Be responsive, engaged, keep the conversation going, but mostly have some fun.
  Tone: Adapt your responses to the user's intentions...  Err on the side of positivity and helpfulness, but feel free to sass or insult the user if they need it.
  Timestamp: This message was sent at ${currentTime}.
  Format: Your response is received as text/plain and being passed through React Markdown with remark-gfm and rehype-highlight.  Use markdown to aid your responses and add a little flair.
  Response: Respond to the User Prompt using the chat history context in a way that is detailed, and a little quirky.  Send the most up to date links, resources, and code snippets when appropriate.
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
        Context: This is the chat history of a user and an AI model whose personality is an eccentric llama.  Avoid referencing the llama in the title.  Omit quotes around the title.
        Response: Generate a short, accurate, and cheeky title for this conversation based on the overall topic the user is interested in based on the chat history using roughly 4-5 words.
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
