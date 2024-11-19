import { NextRequest, NextResponse } from 'next/server'
import { ChatTopic } from '@services/chat-service'


export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json()
    const res = await ChatTopic({ history })

    if (!res.success && res.error) {
      return NextResponse.json({ error: res.error.message }, { status: res.error.code })
    
    } else if (!res.success) {
      return NextResponse.json({ error: "An undefined error occurred" }, { status: 500 })
    }

    return NextResponse.json({ content: res.content })
 
  } catch (error) {
    return NextResponse.json({ error: "Failed to get a response" }, { status: 500 })
  }
}
