export default async function getLoanAccount() {
  try {
    const res = await fetch('/api/accounts/loan', {
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
        number: '54981601396969',
        name: 'KB공무원우대대출(퇴직금에 의한 대출)',
        balance: 2721530,
        contractDate: '20190307',
        dueDate: '20200307',
        interestRate: 8,
      },
    }
  }
}
