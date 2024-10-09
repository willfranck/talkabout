import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai"


const geminiApiKey = process.env.GEMINI_API_KEY
const safetyOptions = [
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
];


async function ChatService({ prompt }: { prompt: string }) {
  if (geminiApiKey !== undefined) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 2.0
        },
        safetySettings: safetyOptions
      })

      const userPrompt = prompt
      const result = await model.generateContent(userPrompt)

      const parsedResult = JSON.parse(result.response.text())
      let parsedText = Object.values(parsedResult).join('\n\n')
      parsedText = parsedText.replace(/(\.)(\s)([A-Z])/g, '$1  $3')

      return parsedText

    } catch (error) {
      console.log(error)
    }
  }
}


export {
  ChatService
}
