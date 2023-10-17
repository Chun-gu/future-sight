export default async function getDallePainting(prompt: string) {
  try {
    const res = await fetch('/api/ai/dalle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    })

    if (res.ok) {
      const data = await res.json()
      return data.imageUrl
    } else throw Error
  } catch (error) {
    return ''
  }
}
