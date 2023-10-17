import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    'https://1163074222.for-seoul.synctreengine.com/fare-payment/sewage/history',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const { result: payments } = (await res.json()) as {
    result: Array<{ PmntAmt: number }>
  }
  let averageSewageFare = Math.floor(
    payments.reduce((acc, cur) => acc + Number(cur['PmntAmt']), 0) /
      payments.length,
  )

  return NextResponse.json({ result: { averageSewageFare } })
}
