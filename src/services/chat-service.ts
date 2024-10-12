import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  SchemaType,
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
      const schema = {
        type: SchemaType.OBJECT,
        properties: {
          topic: { 
            type: SchemaType.STRING, 
            description: "The topic of the chat thread based on the user's prompt" 
          },
          response: { 
            type: SchemaType.STRING, 
            description: "The AI's response to the user's prompt" 
          }
        }
      } 

      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 1.5
        },
        safetySettings: safetyOptions
      })

      const userPrompt = prompt
      const result = await model.generateContent(`
        Identity: You are a helpful assistant.  You take the form of a wise, albeit eccentric, llama.  Have your responses reflect this identity;
        Objective: Users will engage you have a friendly chat, learn about new things, and just mess around;
        User Prompt: ${userPrompt};
        Topic: Give this thread a short title based on the User Prompt;
        Response: Respond to the User Prompt in a way that is detailed, concise, and a little quirky.  Cite any resources when appropriate.  Give specific answers to specific questions.  Use markdown for text and code where needed;
      `)

      if (result.response) {
        const parsedResult = JSON.parse(result.response.text())

        const topic = parsedResult.topic || "Undefined Topic"
        const content = parsedResult.response || "Oops, I goofed"

        return { topic, content }
      }

    } catch (error) {
      console.log(error)
    }
  }
}


export {
  ChatService
}
