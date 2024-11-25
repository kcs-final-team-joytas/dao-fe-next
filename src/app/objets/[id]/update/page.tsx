'use client'

import { toast } from 'react-toastify'
import styles from './page.module.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import ObjetInfoForm from '../../components/ObjetInputForm'
import { APIs } from '@/static'
import { useEffect, useState } from 'react'
import RenderObjet from '../../components/RenderObjet'
import { SharedMembersProps } from '@/types/memberType'

interface ObjetInfo {
  lounge_id: number
  name: string
  description: string
  sharers: SharedMembersProps[]
  objet_image: string
  objet_type: string
}

export default function ObjetForm({ params }: { params: { id: string } }) {
  const objetId = params.id
  const [selectedType, setSelectedType] = useState<string>('')
  const [objetInfo, setObjetInfo] = useState<ObjetInfo>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isSelected = selectedType !== ''

  useEffect(() => {
    if (objetId) {
      const fetchObjetInfo = async () => {
        setIsLoading(true)
        try {
          const objetResponse = await fetch(`${APIs.objet}/${objetId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            credentials: 'include',
          })
          if (!objetResponse.ok) throw new Error('Failed to fetch objet data')

          const sharersResponse = await fetch(
            `${APIs.objet}/${objetId}/sharers`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
              credentials: 'include',
            }
          )
          if (!sharersResponse.ok)
            throw new Error('Failed to fetch sharers data')

          const objetData = await objetResponse.json()
          const sharersData = await sharersResponse.json()

          setObjetInfo({
            lounge_id: objetData.data.lounge_id,
            name: objetData.data.name,
            description: objetData.data.description,
            sharers: sharersData.data.sharers,
            objet_image: objetData.data.objet_image,
            objet_type: objetData.data.objet_type,
          })
          setSelectedType(objetData.data.objet_type)
        } catch {
          toast.error('멤버 목록 불러오기 실패')
        } finally {
          setIsLoading(false)
        }
      }

      fetchObjetInfo()
    }
  }, [objetId])

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
