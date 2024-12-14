'use client'

import { useState } from 'react'
import Layout from '@components/Layout'
import styles from './page.module.css'
import { Skeleton } from 'antd'
import menu from '@images/menu.webp'
import LoungeObjets from '../components/LoungeObjets'
import { useRouter } from 'next/navigation'
import { APIs, URL } from '@/static'
import dynamic from 'next/dynamic'
import { LoungeDrop } from '../components/LoungeDrop'
import useUserStore from '@store/userStore'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@uidotdev/usehooks'
import MobileLoungeObjets from '../components/MobileLoungeObjets'
import { DeleteLoungeModal, WithDrawLoungeModal } from '@components/modal/Modal'
import Image from 'next/image'
import { useMutation, useQuery } from 'react-query'

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  { ssr: false }
)

interface LayoutProps {
  params: { id: string }
}

const fetchLounge = async (loungeId: string) => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(`${APIs.loungeList}/${loungeId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lounge')
  }

  const responseData = await response.json()
  return responseData.data
}

const fetchLoungeObjets = async (loungeId: string) => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(
    `${APIs.objet}?lounge_id=${loungeId}&is_owner=false`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch lounge objects')
  }

  const responseData = await response.json()
  return responseData.data.objets
}

const deleteLounge = async (loungeId: string) => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(`${APIs.loungeList}/${loungeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to delete lounge')
  }

  return response
}

const withdrawLounge = async (loungeId: string) => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(`${APIs.loungeList}/${loungeId}/withdraw`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    throw new Error('Failed to withdraw from lounge')
  }

  return response
}

export default function Lounge({ params }: LayoutProps) {
  const router = useRouter()
  const userId = useUserStore((state) => state.userId)
  const isMobile = useMediaQuery('only screen and (max-width: 425px)')
  const loungeId = params.id
  const [isDrop, setIsDrop] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false)
  const [isClick, setIsClick] = useState(false)

  const { data: loungeData, isLoading } = useQuery(
    ['lounge', loungeId],
    () => fetchLounge(loungeId!),
    {
      retry: 1,
      onError: () => {
        toast.error('해당 라운지를 찾을 수 없습니다 😅')
        router.push(`${URL.lounge}`)
      },
    }
  )

  const { data: objets } = useQuery(
    ['loungeObjet', loungeId],
    () => fetchLoungeObjets(loungeId!),
    {
      retry: 1,
      onError: () => {
        toast.error('해당 라운지의 오브제가 없습니다 😅')
      },
    }
  )

  const deleteLoungeMutation = useMutation(() => deleteLounge(loungeId!), {
    onSuccess: () => {
      toast.success('라운지 삭제 성공 😀')
      router.push(URL.lounge)
    },
    onError: () => {
      toast.error('라운지 삭제 실패 😭')
    },
    onSettled: () => {
      setIsClick(false)
    },
  })

  const withdrawLoungeMutation = useMutation(() => withdrawLounge(loungeId!), {
    onSuccess: () => {
      toast.success('라운지 탈퇴 성공 😀')
      router.push(URL.lounge)
    },
    onError: () => {
      toast.error('라운지 탈퇴 실패 😭')
    },
    onSettled: () => {
      setIsClick(false)
    },
  })

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.loungeTitle}>
            {isLoading ? (
              <Skeleton.Input
                active
                style={{
                  backgroundColor: '#b7d1ea',
                  opacity: '70%',
                  width: '150px',
                  height: '24px',
                }}
              />
            ) : (
              loungeData?.name
            )}
          </div>
          <div
            className={styles.iconContainer}
            onClick={() => setIsDrop(!isDrop)}
          >
            <Image alt='' className={styles.icon} src={menu} />
            {isDrop && (
              <LoungeDrop
                id={Number(loungeId)}
                isDrop={isDrop}
                setIsDrop={setIsDrop}
                setIsDeleteModalVisible={setIsDeleteModalVisible}
                setIsWithdrawModalVisible={setIsWithdrawModalVisible}
                isOwner={loungeData?.user_id === userId}
              />
            )}
          </div>
        </div>
        <div className={styles.subTitle}>
          친구를 초대하고 오브제로 추억을 공유해보세요!
        </div>
        <div
          className={styles.objets}
          style={{ alignItems: `${isMobile && 'flex-start'}` }}
        >
          {isLoading ? (
            <LoadingLottie />
          ) : isMobile ? (
            <MobileLoungeObjets objets={objets} loungeId={Number(loungeId)} />
          ) : (
            <LoungeObjets objets={objets} loungeId={Number(loungeId)} />
          )}
        </div>
      </div>
      <DeleteLoungeModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        handleDelete={deleteLoungeMutation.mutate}
        isClick={isClick}
      />
      <WithDrawLoungeModal
        isOpen={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        handleDelete={withdrawLoungeMutation.mutate}
        isClick={isClick}
      />
    </Layout>
  )
}
