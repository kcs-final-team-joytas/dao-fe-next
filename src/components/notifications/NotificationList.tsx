import NotificationItem from '@/components/notifications/NotficationItem'
import { NotificationProps } from '@hooks/useNotification'
import styles from './NotificationList.module.css'

export default function RenderNotificationList({
  notificationList,
  userId,
}: {
  notificationList: NotificationProps[]
  userId: number
}) {
  const groupedNotifications = groupByDate(notificationList)
  const dates = Object.keys(groupedNotifications)

  return dates.map((date, index) => {
    const dateSort = groupedNotifications[date].filter(
      (noti) => noti.sender.user_id !== userId
    )
    return (
      dateSort.length > 0 && (
        <div className={styles.notificationGroup} key={`${date}_${index}`}>
          <div className={styles.notificationDate}>{date}</div>
          {dateSort.slice().map((noti: NotificationProps) => (
            <NotificationItem
              key={noti.notification_id}
              notification_id={noti.notification_id}
              type={noti.type}
              sender={noti.sender}
              detail={noti.detail}
              is_read={noti.is_read}
              datetime={noti.datetime}
            />
          ))}
          {index !== dates.length - 1 && <hr className={styles.customHr} />}
        </div>
      )
    )
  })
}

function groupByDate(
  notificationList: NotificationProps[]
): Record<string, NotificationProps[]> {
  return notificationList.reduce(
    (acc: Record<string, NotificationProps[]>, noti: NotificationProps) => {
      const date = new Date(noti.datetime).toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      })

      if (!acc[date]) {
        acc[date] = []
      }

      acc[date].push(noti)
      return acc
    },
    {}
  )
}
