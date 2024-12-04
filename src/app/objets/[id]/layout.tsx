'use client'

import Layout from '@components/Layout'
import styles from './layout.module.css'
import { useRouter, usePathname } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { extractYearMonthDate } from '@utils/formatDatetime'
import { APIs } from '@/static'
import { ObjetContext } from '@/types/objetContext'
import SideDropMenu from './components/SideDropMenu'

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
  const id = Number(params.id)

  const path = usePathname()
  const isUpdate = path.includes('update')

  const [callingPeople, setCallingPeople] = useState(0)
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
    } catch {
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
    } catch {
      toast.error('오브제 통화 인원 수 가져오기 실패')
    } finally {
      setIsLoading(false)
    }
  }

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
            <SideDropMenu
              id={id}
              ownerId={objetData?.owner.user_id}
              loungeId={objetData?.lounge_id}
            />
          </div>
        </div>
        <ObjetContext.Provider value={{ objetData, callingPeople }}>
          {children}
        </ObjetContext.Provider>
      </div>
    </Layout>
  )
}
