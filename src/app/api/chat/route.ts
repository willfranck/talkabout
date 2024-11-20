import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@services/chat-service'


export async function POST(req: NextRequest) {
  try {
    const { history, prompt, temperature } = await req.json()
    const res = await ChatService({ history, prompt, temperature })

    if (!res.success && res.error) {
      // GoogleGenAIErrors return as a message string with the code in brackets
      if (!res.error.code) {
        const matchStatus = res.error.message.match(/\[(\d{3})[^\]]*\]/)
        const parsedStatus = matchStatus ? parseInt(matchStatus[1]) : 500

        return NextResponse.json({ error: res.error.message }, { status: parsedStatus })
      }
      // GoogleGenAIFetchErrors return with codes as a number
      return NextResponse.json({ error: res.error.message }, { status: res.error.code })
    
    } else if (!res.success) {
      return NextResponse.json({ error: "An undefined error occurred" }, { status: 500 })
    }

    return NextResponse.json({ content: res.content })
 
  } catch (error) {
    return NextResponse.json({ error: "Failed to get a response" }, { status: 500 })
  }
}
