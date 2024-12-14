'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useRouter } from 'next/navigation'
import { APIs, URL } from '@/static'
import LoungeModel from './LoungeModel'
import type { LoungeProps } from '@/types/loungeType'
import EmptyLounge from './EmptyLounge'
import dynamic from 'next/dynamic'
import { useQuery } from 'react-query'

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  {
    ssr: false,
  }
)

const fetchLoungeList = async (): Promise<LoungeProps[]> => {
  const accessToken = localStorage.getItem('access_token')

  const response = await fetch(APIs.loungeList, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch lounge list')
  }

  const responseData = await response.json()
  return responseData.data
}

export default function LoungeContainer() {
  const router = useRouter()

  const {
    data: loungeList = [],
    isLoading,
    isError,
  } = useQuery('loungeList', fetchLoungeList, {
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch lounge list', error)
    },
  })

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
    router.push(`${URL.lounge}/${lid}`)
    localStorage.setItem('loungeId', String(lid))
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
