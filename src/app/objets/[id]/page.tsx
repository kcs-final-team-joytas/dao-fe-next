'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { useObjetContext } from '@/types/objetContext'
import { APIs, URL } from '@/static'
import useObjetStore from '@/store/objetStore'
import { toast } from 'react-toastify'
import GoCommunityBtn from './components/GoCommunityBtn'
import { ChatMessage } from './components/ChatMessage'
import Image from 'next/image'

interface LayoutProps {
  params: { id: string }
}

interface Message {
  id: string
  type: string
  sender_name: string
  sender_id: number
  sender_profile_url: string
  message: string
  created_at: string
}

export default function Page({ params }: LayoutProps) {
  const router = useRouter()
  const objetContext = useObjetContext()
  const { objetData, callingPeople = 0 } = objetContext || {}
  const id = params.id
  const [chatData, setChatData] = useState<Message[]>()

  const setChatToken = useObjetStore((state) => state.setChatToken)

  const fetchChatData = async () => {
    try {
      const tokenResponse = await fetch(`${APIs.chat}/${id}/room-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to fetch chat token')
      }

      const tokenData = await tokenResponse.json()
      const roomToken = tokenData.data.room_token
      setChatToken(roomToken)

      const chatResponse = await fetch(
        `${APIs.chat}/${roomToken}/messages/recent`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        }
      )

      if (!chatResponse.ok) {
        throw new Error('Failed to fetch chat messages')
      }

      const chatData = await chatResponse.json()
      setChatData(chatData.data.messages)
    } catch {
      toast.error('채팅 가져오기 실패')
    }
  }

  const handleChatClick = () => {
    router.push(`${URL.objet}/${id}/chatting`)
  }

  const handleCallClick = () => {
    if (callingPeople >= 9) {
      toast.error('방이 가득찼습니다! 🥲')
    } else {
      router.push(`${URL.objet}/${id}/call`)
      sessionStorage.setItem(
        'callLoungeId',
        String(objetData?.lounge_id) || '0'
      )
    }
  }

  useEffect(() => {
    fetchChatData()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.detailContainer}>
        {objetData?.objet_image ? (
          <Image
            width={500}
            height={500}
            loading='eager'
            className={styles.objetImg}
            src={objetData?.objet_image || ''}
            alt='Objet Image'
          />
        ) : (
          <div className={styles.cls}></div>
        )}
        <div className={styles.objetDescription}>{objetData?.description}</div>
      </div>
      <div className={styles.divider} />
      <div className={styles.chatPreviewContainer}>
        <div className={styles.chatHeader}>채팅 미리보기</div>
        {chatData && chatData.length > 0 ? (
          <div className={styles.chattingsWrapper}>
            {chatData.map((message: Message, index: number) => (
              <ChatMessage
                key={index}
                userName={message.sender_name}
                userId={message.sender_id}
                profileImg={message.sender_profile_url}
                content={message.message}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noChatting}>채팅 내역이 없습니다.</div>
        )}

        <div className={styles.buttonWrapper}>
          <GoCommunityBtn
            text='채팅 입장'
            className='chatButton'
            onClick={handleChatClick}
          />
          <GoCommunityBtn
            text='음성 통화'
            className='callButton'
            people={callingPeople}
            onClick={handleCallClick}
          />
        </div>
      </div>
    </div>
  )
}
