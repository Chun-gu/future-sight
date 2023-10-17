import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.json()
  const num1 = formData.num1
  const num2 = formData.num2

  const res = await fetch(
    'https://1163074222.for-seoul.synctreengine.com/sum',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ num1, num2 }),
    },
  )
  const data = await res.json()

  return NextResponse.json({ data })
}
