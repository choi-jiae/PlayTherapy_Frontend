export async function getAuthCheck() {
  let isClient = typeof window !== 'undefined';
  if (isClient) {
    const res = await fetch(`/api/auth/authcheck`)
   
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }
  }