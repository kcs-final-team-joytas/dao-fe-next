'use client'
import Layout from '@components/Layout'
import styles from './layout.module.css'
import { useRouter, usePathname } from 'next/navigation'
import useUserStore from '@store/userStore'
import { useRef, useState, useEffect, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { extractYearMonthDate } from '@utils/formatDatetime'
import { APIs, URL } from '@/static'
import menu from '@images/menu.webp'
import Image from 'next/image'
import leaveImage from '@images/leave.webp'
import { ObjetContext } from '@/types/objetContext'
import { DeleteObjetModal } from '@/components/modal/Modal'
import { ObjetDrop } from './components/ObjetDrop'

export interface Objet {
  objet_id: number
  lounge_id?: number
  objet_type: 'O0001' | 'O0002' | 'O0003'
  name: string
  description: string
  created_at: string
  objet_image: string
  owner: {
    nickname: string
    profile_image: string
    user_id: number
  }
}
interface LayoutProps {
  params: { id: string }
  children: React.ReactNode
}

export default function ObjetLayout({ params, children }: LayoutProps) {
  const router = useRouter()
  const id = params.id
  const myUserId = useUserStore((state) => state.userId)

  const path = usePathname()
  const isObjetDetail = path.includes('objet')
  const isChatting = path.includes('chatting')
  const isUpdate = path.includes('update')

  const [isDropVisible, setIsDropVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isDeleteClick, setIsDeleteClick] = useState(false)
  const [callingPeople, setCallingPeople] = useState(0)
  const dropRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [objetData, setObjetData] = useState<Objet>()

  const fetchObjetData = async () => {
    try {
      const response = await fetch(`${APIs.objet}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch objet data')
      }

      const data = await response.json()
      setObjetData(data.data)
    } catch (error) {
      toast.error('해당 오브제를 찾을 수 없습니다 😅')
      router.push('/lounges')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCallingPeople = async () => {
    try {
      const response = await fetch(`${APIs.objet}/${id}/call/participants`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch calling people')
      }

      const data = await response.json()
      setCallingPeople(data.data.calling_user_num)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

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
      router.push(`/lounge/${objetData?.lounge_id}`)
    } catch (error) {
      toast.error('오브제 삭제 실패 😭')
    } finally {
      setIsDeleteModalVisible(false)
      setIsDeleteClick(false)
    }
  }

  const handleDeleteObjet = () => {
    deleteObjet()
  }

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

  useEffect(() => {
    fetchObjetData()
    fetchCallingPeople()
  }, [])

  if (isLoading) {
    return null
  }

  if (isUpdate) {
    return <Layout>{children}</Layout>
  }

  return (
    <Layout>
      {isDeleteModalVisible && <div className={styles.modelBackDrop} />}
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.leftContainer}>
            <div className={styles.callTitle}>{objetData?.name}</div>
            <div className={styles.createdInfo}>
              <div className={styles.objetMaker}>
                <span className={styles.name}>{objetData?.owner.nickname}</span>
              </div>
              <span>|</span>
              <span className={styles.objetDate}>
                {extractYearMonthDate(objetData?.created_at || '')}
              </span>
            </div>
          </div>
          <div className={styles.rightContainer}>
            {isObjetDetail &&
            myUserId === objetData?.owner?.user_id &&
            !isChatting ? (
              <>
                <Image
                  className={styles.menuIcon}
                  src={menu}
                  alt='menu'
                  onClick={() => setIsDropVisible(!isDropVisible)}
                />
                {isDropVisible && (
                  <div ref={dropRef} onClick={(e) => e.stopPropagation()}>
                    <ObjetDrop
                      onClickUpdate={() =>
                        router.push(`${URL.objet}/${id}/update`)
                      }
                      onClickDelete={() => {
                        setIsDeleteModalVisible(true)
                        setIsDropVisible(false)
                      }}
                    />
                  </div>
                )}
              </>
            ) : isChatting ? (
              <Image
                alt='퇴장'
                className='leave'
                src={leaveImage}
                onClick={handleLeaveChat}
              />
            ) : null}
          </div>
        </div>
        <ObjetContext.Provider value={{ objetData, callingPeople }}>
          {children}
        </ObjetContext.Provider>

        {isDeleteModalVisible && (
          <DeleteObjetModal
            isClick={isDeleteClick}
            isOpen={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            handleDelete={handleDeleteObjet}
          />
        )}
      </div>
    </Layout>
  )
}
