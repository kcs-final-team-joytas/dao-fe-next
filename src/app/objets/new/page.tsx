'use client'

import Layout from '@components/Layout'
import styles from './page.module.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Group } from 'three'
import { objetList } from '@components/models/NewObjetModels'
import SelectObjetType from '../components/SelectObjetType'
import ObjetInfoForm from '../components/ObjetInputForm'
import { ObjetInfoFormProps } from '@/types/objetProps'
import { useSearchParams, usePathname } from 'next/navigation'
import { APIs } from '@/static'
import { useEffect, useRef, useState } from 'react'

export default function ObjetForm() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const step = pathname?.includes('new') ? 'create' : 'update'

  const oid = searchParams.get('oid')
  const objetId = step === 'update' ? oid : 0

  const [selectedType, setSelectedType] = useState<string>('')
  const [objetInfo, setObjetInfo] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isSelected = selectedType !== ''

  useEffect(() => {
    if (step === 'update' && objetId) {
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
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchObjetInfo()
    }
  }, [step, objetId])

  return (
    <Layout>
      <div className={styles.globalContainer}>
        <div className={styles.upperContainer}>
          <div>
            <div className={styles.globalTitle}>어떤 오브제인가요?</div>
            <div className={styles.globalSubTitle}>
              공유하고 싶은 추억을 오브제로 만들어보세요!
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
          {step === 'create' ? (
            isSelected ? (
              <ObjetInfoForm path='create' type={selectedType} />
            ) : (
              <SelectObjetType setSelectedType={setSelectedType} />
            )
          ) : (
            !isLoading &&
            objetInfo && (
              <ObjetInfoForm
                path='update'
                type={selectedType}
                objetInfo={objetInfo}
              />
            )
          )}
        </div>
      </div>
    </Layout>
  )
}

function RenderObjet({ type }: ObjetInfoFormProps) {
  const ref = useRef<Group>(null)
  const model = objetList.find((objet) => objet.type === type)?.model

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  const scale: [number, number, number] =
    type === 'O0001'
      ? [1, 1, 1]
      : type === 'O0002'
      ? [3.5, 3.5, 3.5]
      : [48, 48, 48]

  return (
    <group ref={ref} rotation-y={-Math.PI / 2} scale={scale}>
      {model}
    </group>
  )
}
