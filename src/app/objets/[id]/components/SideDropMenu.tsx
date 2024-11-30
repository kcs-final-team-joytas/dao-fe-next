'use client'

import { useRef, useState, useEffect } from 'react'
import useUserStore from '@store/userStore'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import menu from '@images/menu.webp'
import { ObjetDrop } from './ObjetDrop'
import { APIs, URL } from '@/static'
import styles from './SideDropMenu.module.css'
import { DeleteObjetModal } from '@/components/modal/Modal'
import { toast } from 'react-toastify'
import leaveImage from '@images/leave.webp'

export default function SideDropMenu({
  id,
  ownerId,
  loungeId,
}: {
  id: number
  ownerId: number | undefined
  loungeId: number | undefined
}) {
  const router = useRouter()
  const path = usePathname()

  const isObjetDetail = path?.includes('objet')
  const isChatting = path?.includes('chatting')
  const isCalling = path?.includes('call')

  const myUserId = useUserStore((state) => state.userId)

  const isBasic =
    isObjetDetail && !isChatting && !isCalling && myUserId === ownerId
  const isCommunicate = isChatting || isCalling

  const [isDropVisible, setIsDropVisible] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isDeleteClick, setIsDeleteClick] = useState(false)

  const handleLeaveChat = () => {
    router.push(`${URL.objet}/${id}`)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setIsDropVisible(false)
      }
    }

    if (isDropVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropVisible])

  const deleteObjet = async () => {
    try {
      setIsDeleteClick(true)
      const response = await fetch(`${APIs.objet}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete objet')
      }

      toast.success('오브제 삭제 성공 🪐')
      router.push(`/lounges/${loungeId}`)
    } catch {
      toast.error('오브제 삭제 실패 😭')
    } finally {
      setIsDeleteModalVisible(false)
      setIsDeleteClick(false)
    }
  }

  const handleDeleteObjet = () => {
    deleteObjet()
  }

  return (
    <>
      {isBasic ? (
        <>
          <div className={styles.rightContainer}>
            <Image
              className={styles.menuIcon}
              src={menu}
              alt='menu'
              onClick={() => setIsDropVisible(!isDropVisible)}
            />
            {isDropVisible && (
              <div ref={dropRef} onClick={(e) => e.stopPropagation()}>
                <ObjetDrop
                  onClickUpdate={() => router.push(`${URL.objet}/${id}/update`)}
                  onClickDelete={() => {
                    setIsDeleteModalVisible(true)
                    setIsDropVisible(false)
                  }}
                />
              </div>
            )}
          </div>
          {isDeleteModalVisible && (
            <DeleteObjetModal
              isClick={isDeleteClick}
              isOpen={isDeleteModalVisible}
              onClose={() => setIsDeleteModalVisible(false)}
              handleDelete={handleDeleteObjet}
            />
          )}
        </>
      ) : (
        isCommunicate && (
          <Image
            alt='퇴장'
            className='leave'
            src={leaveImage}
            onClick={handleLeaveChat}
          />
        )
      )}
    </>
  )
}
