import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@services/chat-service'


export async function POST(req: NextRequest) {
  try {
    const { history, prompt, temperature } = await req.json()
    const res = await ChatService({ history, prompt, temperature })
    return NextResponse.json({ res })
 
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get a response'}, { status: 500 })
  }
}
