import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const body = await request.json()
  const response = await openai.images.generate({
    prompt: body,
    n: 1,
    size: '512x512',
  })

  const imageUrl = response.data[0].url

  return NextResponse.json({ imageUrl })
}
