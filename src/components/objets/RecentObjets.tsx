'use client'

import useUserStore from '@store/userStore'
import { useEffect, useState } from 'react'
import ObjetPreview from '@components/objets/ObjetPreview'
import dynamic from 'next/dynamic'
import NoPrevObjet from '@components/objets/NoPrevObjet'
import styles from './RecentObjets.module.css'
import { APIs } from '@/static'

export default function RecentObjets() {
  const [objets, setObjets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const LoadingLottie = dynamic(
    () => import('@/components/lotties/LoadingLottie'),
    { ssr: false }
  )

  const userId = useUserStore((state) => state.userId)

  useEffect(() => {
    if (userId) {
      const fetchObjetPreviews = async () => {
        try {
          const response = await fetch(APIs.objetPreview, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            credentials: 'include',
          })
          const data = await response.json()
          setObjets(data.data || [])
        } catch (error) {
          console.error('Failed to fetch objets', error)
          setError(true)
        } finally {
          setIsLoading(false)
        }
      }

      fetchObjetPreviews()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className={styles.lottieContainer}>
        <LoadingLottie />
      </div>
    )
  }

  if (error || objets.length === 0) {
    return <NoPrevObjet />
  }

  return <ObjetPreview objets={objets} />
}
