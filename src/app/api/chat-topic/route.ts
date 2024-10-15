import { NextRequest, NextResponse } from 'next/server'
import { ChatTopic } from '@services/chat-service'


export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json()
    const res = await ChatTopic({ history })
    return NextResponse.json({ res })
 
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get a response'}, { status: 500 })
  }
}
