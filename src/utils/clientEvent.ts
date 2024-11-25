'use client'

import { useEffect } from 'react'
import { useUserInfo } from '@hooks/useUserInfo'
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill'
import { APIs } from '@/static'
import useUserStore from '@store/userStore'
import {
  NotificationProps,
  ConnectNotificationProps,
} from '@hooks/useNotification'
import { toast } from 'react-toastify'

export default function ClientEventSource() {
  const { getProfile } = useUserInfo()
  const userId = useUserStore((state) => state.userId)

  useEffect(() => {
    getProfile()

    const eventSourceInstance = new (EventSourcePolyfill || NativeEventSource)(
      `${APIs.notification}/subscribe`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    )

    const listener = {
      handleEvent(event: Event) {
        const messageEvent = event as MessageEvent
        try {
          const data: NotificationProps | ConnectNotificationProps = JSON.parse(
            messageEvent.data
          )

          if ('message' in data) {
            return
          } else if (
            'notification_id' in data &&
            data.sender.user_id !== userId
          ) {
            let message = ''
            if (data.type === 'N0001') {
              message = `${data.sender.nickname}님이 "${data.detail.name}" 라운지에 초대하셨습니다 💫`
            } else if (data.type === 'N0002') {
              message = `${data.sender.nickname}님이 "${data.detail.name}" 오브제에 태그하셨습니다 💫`
            } else if (data.type === 'N0003') {
              message = `${data.sender.nickname}님이 콕 찌르셨습니다 💫`
            }
            toast(message)
          }
        } catch (error) {
          console.error('Failed to parse event data:', error)
        }
      },
    }

    eventSourceInstance.addEventListener('NOTIFICATION_EVENT', listener)

    return () => {
      eventSourceInstance.close()
    }
  }, [])

  return null
}
