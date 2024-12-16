import styles from '../page.module.css'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useState } from 'react'
import { APIs } from '@/static'
import Layout from '@components/Layout'
import MobileLoungeObjets from '@/app/lounges/components/MobileLoungeObjets'
import LoungeObjets from '@/app/lounges/components/LoungeObjets'
import Image from 'next/image'
import moreImg from '@images/more.webp'
import { LoungeListModal } from '@components/modal/Modal'
import { useQuery } from 'react-query'
import dynamic from 'next/dynamic'

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  { ssr: false }
)

interface Lounge {
  lounge_id: number
  name: string
  type: string
}

const fetchLoungeObjets = async (loungeId: number) => {
  const url =
    loungeId === 0
      ? `${APIs.objet}/me`
      : `${APIs.objet}?lounge_id=${loungeId}&is_owner=true`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lounge objets')
  }

  const data = await response.json()
  return loungeId === 0 ? data.data : data.data.objets
}

const fetchLounges = async () => {
  const response = await fetch(APIs.loungeList, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lounges')
  }

  const data = await response.json()
  return [{ lounge_id: 0, name: '전체', type: '전체' }, ...data.data]
}

export default function MyRoomObjet() {
  const isMobile = useMediaQuery('only screen and (max-width : 425px)')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLounge, setSelectedLounge] = useState<Lounge>({
    lounge_id: 0,
    name: '전체',
    type: '전체',
  })
  const [loungeId, setLoungeId] = useState(0)

  const {
    data: objets,
    isLoading: isObjetsLoading,
    refetch: refetchObjets,
  } = useQuery(['objets', loungeId], () => fetchLoungeObjets(loungeId), {
    retry: 1,
    enabled: true,
    onError: (error) => {
      console.error('Failed to fetch objets', error)
    },
  })

  const { data: lounges, isLoading: isLoungesLoading } = useQuery<Lounge[]>(
    'lounges',
    fetchLounges,
    {
      retry: 1,
      onError: (error) => {
        console.error('Failed to fetch lounges', error)
      },
    }
  )

  const handleSelectLounge = (loungeId: number) => {
    setIsModalOpen(false)
    const selected = lounges?.find(
      (lounge: Lounge) => lounge.lounge_id === loungeId
    )
    if (selected) {
      setSelectedLounge(selected)
      setLoungeId(loungeId)
      refetchObjets()
    }
  }

  if (isLoungesLoading) {
    return (
      <Layout>
        <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
          <LoadingLottie />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <>
        {isModalOpen && <div className={styles.modalBackDrop} />}

        <div className={styles.container}>
          <div className={styles.topContainer}>
            <div className={styles.title}>{selectedLounge.name}</div>
            <div className={styles.iconContainer}>
              <Image
                className={styles.icon}
                src={moreImg}
                onClick={() => {
                  setIsModalOpen(true)
                }}
                alt='more'
              />
            </div>
          </div>
          <div className={styles.subtitle}>
            나에게 전달된 오브제를 확인해보세요!
          </div>
          {!isObjetsLoading && objets ? (
            <div
              className={styles.objets}
              style={{ alignItems: `${isMobile && 'flex-start'}` }}
            >
              {isMobile ? (
                <MobileLoungeObjets
                  objets={objets || []}
                  loungeId={Number(selectedLounge.lounge_id)}
                />
              ) : (
                <LoungeObjets
                  objets={objets || []}
                  loungeId={Number(selectedLounge.lounge_id)}
                />
              )}
            </div>
          ) : (
            <LoadingLottie />
          )}

          {isModalOpen && (
            <LoungeListModal
              onClose={() => setIsModalOpen(false)}
              handleSelectLounge={handleSelectLounge}
              selectedLounge={selectedLounge.lounge_id}
              lounges={lounges}
            />
          )}
        </div>
      </>
    </Layout>
  )
}
