import { NotificationProps } from '@hooks/useNotification'
import { extractTime } from '@utils/formatDatetime'
import TagImg from '@images/tag.webp'
import PokeImg from '@images/poke.webp'
import InviteImg from '@images/loungeInvite.webp'
import { useState } from 'react'
import { ConfirmNotificationModal } from '@components/modal/Modal'
import { APIs, URL } from '@/static'
import { toast } from 'react-toastify'
import styles from './NotificationItem.module.css'
import { useRouter } from 'next/navigation'
import { StaticImageData } from 'next/image'
import Image from 'next/image'

export default function NotificationItem({
  notification_id,
  type,
  is_read,
  sender,
  detail,
  datetime,
}: NotificationProps) {
  const typeEmoji: {
    N0001: StaticImageData
    N0002: StaticImageData
    N0003: StaticImageData
    voice: StaticImageData
  } = {
    N0001: InviteImg,
    N0002: TagImg,
    N0003: PokeImg,
    voice: TagImg,
  }

  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter()

  const markNotificationAsRead = async (notification_id: number) => {
    const response = await fetch(
      `${APIs.notification}/${notification_id}/read`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      }
    )

    if (!response.ok) {
      throw new Error('알림 읽기 실패')
    }

    return response
  }

  const handleAcceptLoungeNoti = async () => {
    try {
      await markNotificationAsRead(notification_id)
      setIsModalVisible(false)
      const response = await fetch(
        `${APIs.loungeList}/${detail.domain_id}/invite/accept`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        }
      )

      if (!response.ok) {
        throw new Error('라운지 초대 수락에 실패했습니다.')
      }
      router.push(`${URL.lounge}/${detail.domain_id}`)
    } catch {
      toast.error('오류가 발생했습니다. 다음에 다시 시도해주세요.')
    }
  }

  const handleDeclineLoungeNoti = async () => {
    await markNotificationAsRead(notification_id)
    setIsModalVisible(false)
  }

  const handleClickObjetNoti = async () => {
    await markNotificationAsRead(notification_id)
    router.push(`${URL.objet}/${detail.domain_id}`)
  }

  const handleClickPokeNoti = async () => {
    await markNotificationAsRead(notification_id)
    router.push(`${URL.userDetail}/${sender.user_id}`)
  }

  let text = ''
  switch (type) {
    case 'N0001':
      text = `${sender.nickname}님이 ${detail.name} 라운지에 초대했습니다. \n 클릭 시 라운지 초대를 수락합니다.`
      break
    case 'N0002':
      text = `${sender.nickname}님이 ${detail.name} 오브제에 태그했습니다.`
      break
    case 'N0003':
      text = `${sender.nickname}님이 콕 찔렀습니다.`
      break
  }

  return (
    <>
      {isModalVisible && <div className={styles.modalBackDrop} />}

      <div
        className={`${styles.notificationItemContainer} ${
          is_read ? styles.read : ''
        }`}
        onClick={() => {
          if (type === 'N0001') {
            setIsModalVisible(true)
          } else if (type === 'N0002') {
            handleClickObjetNoti()
          } else {
            handleClickPokeNoti()
          }
        }}
      >
        <Image
          src={typeEmoji[type as keyof typeof typeEmoji]}
          className={styles.typeImg}
          alt=''
        />
        <span className={styles.notiContents}>{text}</span>
        <span className={styles.notiDatetime}>{extractTime(datetime)}</span>
      </div>

      {isModalVisible && (
        <ConfirmNotificationModal
          onClose={handleDeclineLoungeNoti}
          onConfirm={handleAcceptLoungeNoti}
        />
      )}
    </>
  )
}
