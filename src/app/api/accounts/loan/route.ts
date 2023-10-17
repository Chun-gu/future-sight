import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    'https://1163074222.for-seoul.synctreengine.com/accounts/loan',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const { result: loanAccount } = await res.json()

  return NextResponse.json({ result: { loanAccount } })
}
