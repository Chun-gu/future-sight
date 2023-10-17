export default async function getLoanAccount() {
  try {
    const res = await fetch('/api/accounts/transaction', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) return await res.json()
    else throw Error
  } catch (error) {
    return {
      result: {
        out: 0,
        in: 0,
      },
    }
  }
}
