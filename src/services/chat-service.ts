import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai"
import { ChatMessage } from "@types"


const geminiApiKey = process.env.GEMINI_API_KEY
const safetyOptions = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
];


async function ChatService({ prompt }: { prompt: ChatMessage }) {
  if (geminiApiKey !== undefined) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
        safetySettings: safetyOptions
      })

      const userPrompt = prompt.content
      const result = await model.generateContent(userPrompt)

      console.log(result.response.text())

      return result.response.text()

    } catch (error) {
      console.log(error)
    }
  }
}


export {
  ChatService
}
