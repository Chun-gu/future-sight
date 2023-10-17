import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    'https://1163074222.for-seoul.synctreengine.com/accounts/transactions',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const transactions = (await res.json()) as Array<{ out: number; in: number }>
  const result = { out: 0, in: 0 }

  transactions.forEach((transaction) => {
    result['out'] -= transaction.out
    result['in'] += transaction.in
  })

  return NextResponse.json({ result: { transaction: result } })
}
