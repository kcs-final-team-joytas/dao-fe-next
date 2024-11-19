'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './page.module.css'
import { connectToRoom, disconnectFromRoom } from '@utils/stomp'
import { APIs } from '@/static'
import { useIntersectionObserver } from '@hooks/useIntersectionObserver'
import useObjetStore from '@/store/objetStore'
import { toast } from 'react-toastify'
import send from '@images/send.webp'
import Image from 'next/image'
import RenderChattingList from './components/RenderChattingList'
import type { Message } from '@/types/messageType'

export default function Page() {
  const chatToken = useObjetStore((state) => state.chatToken)
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [shouldWait, setShouldWait] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const { ref: firstMessageRef } = useIntersectionObserver(
    async (entry, observer) => {
      if (entry.isIntersecting && !loading && chatRef.current) {
        observer.unobserve(entry.target)
        await getMoreMessages(
          chatRef.current.scrollHeight,
          chatRef.current.scrollTop
        )
      }
    },
    { root: chatRef.current, threshold: 1 }
  )

  useEffect(() => {
    if (chatToken) {
      connectToRoom(chatToken, handleEnterChat, handleIncomingMessage)
    }
    getMessages()

    return () => {
      disconnectFromRoom(handleLeaveChat)
    }
  }, [chatToken])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const getMessages = async () => {
    try {
      const response = await fetch(`${APIs.chat}/${chatToken}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.data.messages)
      setHasMore(data.data.has_next)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoreMessages = async (
    prevScrollHeight: number,
    prevScrollTop: number
  ) => {
    const lastMessageId = messages[0]?.id
    if (!lastMessageId || !hasMore || loading) return

    try {
      setLoading(true)
      const response = await fetch(
        `${APIs.chat}/${chatToken}/messages?cursorId=${lastMessageId}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        }
      )
      if (!response.ok) throw new Error('Failed to fetch more messages')
      const responseData = await response.json()
      setMessages((prev) => [...responseData.data.messages, ...prev])
      setHasMore(responseData.data.has_next)

      setTimeout(() => {
        if (chatRef.current) {
          const nextScrollHeight = chatRef.current.scrollHeight
          chatRef.current.scrollTop =
            nextScrollHeight - prevScrollHeight + prevScrollTop
        }
      }, 0)
    } catch (error) {
      console.error('Failed to fetch more messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (!chatRef.current) return

    setIsAtBottom(chatRef.current.scrollTop >= chatRef.current.clientHeight)

    if (messages.length >= 21 || !isAtBottom) {
      scrollToBottom()
    }
  }, [messages])

  const handleEnterChat = async () => {
    try {
      await fetch(`${APIs.chat}/chat/greet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          message: null,
          type: 'ENTER',
          room_token: chatToken,
        }),
      })
    } catch (error) {
      console.error('Failed to enter chat:', error)
    }
  }

  const handleIncomingMessage = (message: string) => {
    setMessages((prev) => [...prev, JSON.parse(message)])
  }

  const handleSendMessage = async () => {
    if (shouldWait) return
    const messageToSend = messageInput.trim()
    if (!messageToSend) return

    try {
      await fetch(`${APIs.chat}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          message: messageToSend,
          type: 'TALK',
          room_token: chatToken,
        }),
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.info('Please wait before sending another message.')
      setShouldWait(true)
      setTimeout(() => setShouldWait(false), 2000)
    } finally {
      setMessageInput('')
      scrollToBottom()
    }
  }

  const handleLeaveChat = async () => {
    try {
      await fetch(`${APIs.chat}/chat/greet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          message: null,
          type: 'LEAVE',
          room_token: chatToken,
        }),
      })
    } catch (error) {
      console.error('Failed to leave chat:', error)
    }
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatsWrapper} ref={chatRef}>
        <RenderChattingList
          chattingList={messages}
          firstMessageRef={firstMessageRef}
        />
      </div>
      <div className={styles.chatInputBox}>
        <input
          className={styles.chatInput}
          placeholder='Enter your message'
          value={messageInput}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          className={styles.chatSendButton}
          onClick={handleSendMessage}
          disabled={shouldWait}
        >
          <Image src={send} alt='' />
        </button>
      </div>
    </div>
  )
}
