'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useRouter } from 'next/navigation'
import { APIs, URL } from '@/static'
import LoungeModel from './LoungeModel'
import type { LoungeProps } from '@/types/loungeType'
import EmptyLounge from './EmptyLounge'
import dynamic from 'next/dynamic'

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  {
    ssr: false,
  }
)

export default function LoungeContainer() {
  const router = useRouter()
  const [loungeList, setLoungeList] = useState<LoungeProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchLoungeList = async () => {
      setIsLoading(true)
      setIsError(false)

      try {
        const response = await fetch(APIs.loungeList, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch lounge list')
        }

        const data = await response.json()
        setLoungeList(data.data)
      } catch (error) {
        console.error('Failed to fetch lounge list', error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoungeList()
  }, [])

  const modelLocationWithNew = [
    new Vector3(0.9, 1.4, 0),
    new Vector3(-0.9, -1, 0),
    new Vector3(0.9, -1, 0),
  ]

  const modelLocation = [
    new Vector3(-0.9, 1.4, 0),
    new Vector3(0.9, 1.4, 0),
    new Vector3(-0.9, -1, 0),
    new Vector3(0.9, -1, 0),
  ]

  const handleClickNewLounge = () => {
    router.push(URL.newLounge)
  }

  const handleClickLounge = (lid: number) => {
    localStorage.setItem('loungeId', String(lid))
    router.push(`${URL.lounge}/${lid}`)
  }

  if (isLoading) return <LoadingLottie />

  if (isError || loungeList.length === 0) return <EmptyLounge />

  return (
    <Suspense fallback={<LoadingLottie />}>
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
        camera={{ position: [0, 0, 8], fov: 50 }}
      >
        <ambientLight intensity={1} />
        <group position={[0, 0, 0]}>
          {loungeList.length >= 4 ? null : (
            <LoungeModel
              type='L0004'
              position={new Vector3(-0.9, 1.4, 0)}
              label='새 라운지 만들기'
              scale={[0.6, 0.6, 0.6]}
              onClick={handleClickNewLounge}
            />
          )}
          {loungeList.map((lounge, index) => (
            <LoungeModel
              key={index}
              type={lounge.type}
              position={
                loungeList.length < 4
                  ? modelLocationWithNew[index]
                  : modelLocation[index]
              }
              label={lounge.name}
              onClick={() => handleClickLounge(lounge.lounge_id)}
            />
          ))}
        </group>
      </Canvas>
    </Suspense>
  )
}
