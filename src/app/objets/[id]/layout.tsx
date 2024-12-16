'use client'

import Layout from '@components/Layout'
import styles from './layout.module.css'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { extractYearMonthDate } from '@utils/formatDatetime'
import { APIs, URL } from '@/static'
import { ObjetContext } from '@/types/objetContext'
import SideDropMenu from './components/SideDropMenu'
import { useMutation, useQuery } from 'react-query'
import modalStyles from '@/components/modal/Modal.module.css'
import { DeleteObjetModal } from '@components/modal/Modal'
import useUserStore from '@store/userStore'

interface LayoutProps {
  params: { id: string }
  children: React.ReactNode
}

const fetchData = async (objetId: string) => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(`${APIs.objet}/${objetId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }

  const responseData = await response.json()
  return responseData.data
}

const fetchCall = async (objetId: string) => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(`${APIs.objet}/${objetId}/call/participants`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch call data')
  }

  const responseData = await response.json()
  return responseData.data.calling_user_num
}

export default function ObjetLayout({ params, children }: LayoutProps) {
  const router = useRouter()
  const id = params.id

  const path = usePathname()
  const isObjetDetail = path.includes('objet')
  const isUpdate = path.includes('update')
  const isChatting = path.includes('chatting')
  const isCalling = path.includes('call')

  const myUserId = useUserStore((state) => state.userId)

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isDeleteClick, setisDeleteClick] = useState(false)

  const { data: objetData, isLoading } = useQuery(
    ['objetData', id],
    () => fetchData(id),
    {
      retry: 1,
      onError: () => {
        toast.error('해당 오브제를 찾을 수 없습니다 😅')
        router.push(`${URL.lounge}`)
      },
    }
  )

  const { data: callingPeople } = useQuery(
    ['callingPeople', id],
    () => fetchCall(id),
    {
      retry: 1,
      onError: () => {
        console.error('Failed to fetch calling people')
      },
    }
  )

  const deleteMutation = useMutation(
    async () => {
      setisDeleteClick(true)
      await fetch(`${APIs.objet}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    },
    {
      onSuccess: () => {
        toast.success('오브제 삭제 성공 🪐')
        router.push(`${URL.lounge}/${objetData.lounge_id}`)
      },
      onError: () => {
        toast.error('오브제 삭제 실패 😭')
      },
      onSettled: () => {
        setIsDeleteModalVisible(false)
        setisDeleteClick(false)
      },
    }
  )

  const handleDeleteObjet = () => {
    deleteMutation.mutate()
  }

  if (isLoading) {
    return null
  }

  if (isUpdate) {
    return <Layout>{children}</Layout>
  }

  return (
    <Layout>
      <>
        {isDeleteModalVisible && (
          <>
            <div className={modalStyles.modalBackdrop} />
            <DeleteObjetModal
              isClick={isDeleteClick}
              isOpen={isDeleteModalVisible}
              onClose={() => setIsDeleteModalVisible(false)}
              handleDelete={handleDeleteObjet}
            />
          </>
        )}

        <div className={styles.container}>
          <div className={styles.topContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.callTitle}>{objetData?.name}</div>
              <div className={styles.createdInfo}>
                <div className={styles.objetMaker}>
                  <span className={styles.name}>
                    {objetData?.owner.nickname}
                  </span>
                </div>
                <span>|</span>
                <span className={styles.objetDate}>
                  {extractYearMonthDate(objetData?.created_at || '')}
                </span>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <SideDropMenu
                id={parseInt(id)}
                ownerId={objetData?.owner.user_id}
                isChatting={isChatting}
                isCalling={isCalling}
                isObjetDetail={isObjetDetail}
                myUserId={myUserId}
                isDeleteModalVisible={isDeleteModalVisible}
                setIsDeleteModalVisible={setIsDeleteModalVisible}
              />
            </div>
          </div>
          <ObjetContext.Provider value={{ objetData, callingPeople }}>
            {children}
          </ObjetContext.Provider>
        </div>
      </>
    </Layout>
  )
}
