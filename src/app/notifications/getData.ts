import { APIs } from '@/static'

export const getData = async (cursor: number | null = null) => {
  const url =
    cursor !== null
      ? `${APIs.notification}?cursor=${cursor}`
      : APIs.notification
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch notifications')
  }
  return response.json()
}
