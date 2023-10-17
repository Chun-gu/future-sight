import { Expense, Information } from '@/types'

type Param = {
  information: Information
  expense: Expense
  plan: string
}

export default async function getGptAnswer({
  information,
  expense,
  plan,
}: Param) {
  try {
    const res = await fetch('/api/fare-payment/ai/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body:JSON.stringify()
    })

    if (res.ok) return await res.json()
    else throw Error
  } catch (error) {
    return {
      result: { averageElectricityFare: 9230 },
    }
  }
}
