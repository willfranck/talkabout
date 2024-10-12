import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@services/chat-service'


export async function POST(req: NextRequest) {
  try {
    const { prompt, temperature } = await req.json()
    const res = await ChatService({ prompt, temperature })
    return NextResponse.json({ res })
 
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get a response'}, { status: 500 })
  }
}
