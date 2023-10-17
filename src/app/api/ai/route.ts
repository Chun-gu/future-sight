import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const body = await request.json()

  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: body }],
    model: 'gpt-3.5-turbo',
  })

  return NextResponse.json({ data: chatCompletion.choices[0].message.content })
}
