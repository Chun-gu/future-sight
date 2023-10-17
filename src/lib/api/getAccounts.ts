export default async function getAccounts() {
  try {
    const res = await fetch('/api/accounts', {
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
        customer: {
          id: '8106242937993',
          name: '감아니',
        },
        accounts: [
          {
            name: 'KB Star*t통장-저축예금',
            number: '65520201380910',
            balance: 3863175,
          },
        ],
      },
    }
  }
}
