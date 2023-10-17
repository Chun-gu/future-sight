import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const res = await fetch(
    'https://1163074222.for-seoul.synctreengine.com/gpt',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await res.json()

  return NextResponse.json({ data })
}
