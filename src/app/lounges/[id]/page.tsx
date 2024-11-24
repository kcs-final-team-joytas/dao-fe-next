'use client'

import { useState, useEffect } from 'react'
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

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  { ssr: false }
)

interface LayoutProps {
  params: { id: string }
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
  const [loungeData, setLoungeData] = useState<any>(null)
  const [objets, setObjets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('loungeId', String(loungeId))
  }, [loungeId])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const loungeResponse = await fetch(`${APIs.loungeList}/${loungeId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })

        const objetsResponse = await fetch(
          `${APIs.objet}?lounge_id=${loungeId}&is_owner=false`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )

        if (loungeResponse.ok && objetsResponse.ok) {
          const loungeData = await loungeResponse.json()
          const objetsData = await objetsResponse.json()
          setLoungeData(loungeData.data)
          setObjets(objetsData.data.objets)
        } else {
          throw new Error('Failed to fetch data')
        }
      } catch (error) {
        console.error(error)
        toast.error('데이터를 가져오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteLounge = async () => {
    try {
      const response = await fetch(`${APIs.loungeList}/${loungeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (response.ok) {
        toast.success('라운지 삭제 성공 😀')
        router.push(URL.lounge)
      } else {
        throw new Error('Failed to delete lounge')
      }
    } catch (error) {
      toast.error('라운지 삭제 실패 😭')
      console.error(error)
    } finally {
      setIsClick(false)
    }
  }

  const handleWithdrawLounge = async () => {
    try {
      const response = await fetch(`${APIs.loungeList}/${loungeId}/withdraw`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (response.ok) {
        toast.success('라운지 탈퇴 성공 😀')
        router.push(URL.lounge)
      } else {
        throw new Error('Failed to withdraw from lounge')
      }
    } catch (error) {
      toast.error('라운지 탈퇴 실패 😭')
      console.error(error)
    } finally {
      setIsClick(false)
    }
  }

  return (
    <Layout>
      <div className={styles.globalContainer32}>
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
        <div className={styles.globalTitle}>
          친구를 초대하고 오브제로 추억을 공유해보세요!
        </div>
        <div className={styles.objets}>
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
        handleDelete={handleDeleteLounge}
        isClick={isClick}
      />
      <WithDrawLoungeModal
        isOpen={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        handleDelete={handleWithdrawLounge}
        isClick={isClick}
      />
    </Layout>
  )
}
