'use client'

import { toast } from 'react-toastify'
import styles from './page.module.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ObjetInfoForm from '../../components/ObjetInputForm'
import { APIs, URL } from '@/static'
import { useState } from 'react'
import RenderObjet from '../../components/RenderObjet'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'

const fetchObjetInfo = async (objetId: string) => {
  const response = await fetch(`${APIs.objet}/${objetId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to fetch objet data')

  return response.json()
}

const fetchSharers = async (objetId: string) => {
  const response = await fetch(`${APIs.objet}/${objetId}/sharers`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })
  if (!response.ok) throw new Error('Failed to fetch sharers data')

  return response.json()
}

export default function ObjetForm({ params }: { params: { id: string } }) {
  const objetId = params.id
  const [selectedType, setSelectedType] = useState<string>('')
  const isSelected = selectedType !== ''
  const router = useRouter()

  const { data: objetInfo, isLoading } = useQuery(
    ['objetInfo', objetId],
    async () => {
      const [objetResponse, sharersResponse] = await Promise.all([
        fetchObjetInfo(objetId),
        fetchSharers(objetId),
      ])

      return {
        lounge_id: objetResponse.data.lounge_id,
        name: objetResponse.data.name,
        description: objetResponse.data.description,
        sharers: sharersResponse.data.sharers,
        objet_image: objetResponse.data.objet_image,
        objet_type: objetResponse.data.objet_type,
      }
    },
    {
      retry: 1,
      onSuccess: (data) => {
        setSelectedType(data?.objet_type || '')
      },
      onError: () => {
        toast.error('해당 오브제를 찾을 수 없습니다 😅')
        router.push(`${URL.lounge}`)
      },
    }
  )

  return (
    <>
      <div className={styles.globalContainer}>
        <div className={styles.upperContainer}>
          <div>
            <div className={styles.globalTitle}>어떤 오브제인가요?</div>
            <div className={styles.globalSubTitle}>
              공유하고 싶은 추억을 오브제를 수정해주세요!
            </div>
          </div>
          <div className={styles.miniObjetModel}>
            {isSelected && (
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <OrbitControls enableZoom={false} enableRotate={false} />
                <ambientLight intensity={1.7} />
                <RenderObjet type={selectedType} />
              </Canvas>
            )}
          </div>
        </div>

        <div className={styles.container}>
          {!isLoading && objetInfo && (
            <ObjetInfoForm
              path='update'
              type={selectedType}
              objetInfo={objetInfo}
              updateObjetId={objetId}
            />
          )}
        </div>
      </div>
    </>
  )
}
