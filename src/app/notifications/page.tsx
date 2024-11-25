'use client'

import Layout from '@/components/Layout'
import { NotificationProps } from '@hooks/useNotification'
import useUserStore from '@store/userStore'
import left from '@assets/images/left.webp'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './page.module.css'
import { getData } from './getData'
import RenderNotificationList from '@/components/notifications/NotificationList'
import { toast } from 'react-toastify'

export default function Notifications() {
  const router = useRouter()
  const userId = useUserStore((state) => state.userId)

  const [notifications, setNotifications] = useState<NotificationProps[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const [hasNext, setHasNext] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const targetRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver>()

  const loadMoreNotifications = useCallback(async () => {
    if (!hasNext || isFetching || cursor === null) return

    setIsFetching(true)
    try {
      const data = await getData(cursor)
      setNotifications((prev) => {
        const newNotifications = data.data.notifications.filter(
          (newNoti: NotificationProps) =>
            !prev.some(
              (prevNoti) => prevNoti.notification_id === newNoti.notification_id
            )
        )
        return [...prev, ...newNotifications]
      })
      setHasNext(data.data.has_next)
      setCursor(data.data.next_cursor)
    } catch {
      toast.error('알림 가져오기 실패')
    } finally {
      setIsFetching(false)
    }
  }, [cursor, hasNext, isFetching])

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNext && !isFetching && cursor !== null) {
        loadMoreNotifications()
      }
    }

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(handleObserver)
    if (targetRef.current) {
      observer.current.observe(targetRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [loadMoreNotifications, hasNext, isFetching, cursor])

  useEffect(() => {
    const initialFetch = async () => {
      setIsFetching(true)
      try {
        const data = await getData()
        setNotifications(data.data.notifications)
        setHasNext(data.data.has_next)
        setCursor(data.data.next_cursor)
      } catch {
        toast.error('알림 가져오기 실패')
      } finally {
        setIsFetching(false)
      }
    }
    initialFetch()
  }, [])

  return (
    <Layout>
      <div className={styles.topContainer}>
        <p className={styles.globalTitle}>
          <Image
            className={styles.titleImage}
            src={left}
            alt='left'
            onClick={() => router.back()}
          />
          알림
        </p>
        <div className={styles.notificationContainer}>
          {notifications.length === 0 ? (
            <span className={styles.blacnkContainerText}>알림이 없습니다.</span>
          ) : (
            <RenderNotificationList
              notificationList={notifications}
              userId={userId}
            />
          )}
          <div ref={targetRef} style={{ height: '10px', width: '10px' }} />
          {isFetching && <p>Loading more...</p>}
        </div>
      </div>
    </Layout>
  )
}
