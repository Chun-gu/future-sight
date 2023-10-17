export default async function getElectricFarePayment() {
  try {
    const res = await fetch('/api/fare-payment/sewage/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) return await res.json()
    else throw Error
  } catch (error) {
    return {
      result: { averageSewageFare: 216046 },
    }
  }
}
