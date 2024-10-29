import { APIs } from '@/static'
import { useQuery } from 'react-query'

export interface NotificationProps {
  notification_id: number
  type: string
  is_read: boolean
  sender: {
    user_id: number
    nickname: string
  }
  detail: {
    domain_id: number
    name: string
  }
  datetime: string
}

export interface ConnectNotificationProps {
  message: string
}

const fetchNotifications = async (): Promise<NotificationProps[]> => {
  const response = await fetch(APIs.notification, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch notifications')
  }

  const data = await response.json()
  return data.data
}

const useNotifications = () => {
  const {
    data: notificationList = [],
    error,
    isLoading,
  } = useQuery('notifications', fetchNotifications, {
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch notifications', error)
    },
  })

  return { notificationList, error, isLoading }
}

export default useNotifications
