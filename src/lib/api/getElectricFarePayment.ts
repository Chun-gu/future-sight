export default async function getElectricityFarePayment() {
  try {
    const res = await fetch('/api/fare-payment/electricity/history', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) return await res.json()
    else throw Error
  } catch (error) {
    return {
      result: { averageElectricityFare: 9230 },
    }
  }
}
