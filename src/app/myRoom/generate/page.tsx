'use client'

import { useRouter } from 'next/navigation'
import useUserStore from '@store/userStore'
import { useEffect, useState } from 'react'
import { modelList, MyRoomModel } from '@components/models/MyRoomModels'
import { toast } from 'react-toastify'
import { APIs, URL } from '@/static'
import Layout from '@components/Layout'
import styles from './page.module.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Image from 'next/image'
import { useMutation, useQuery } from 'react-query'

const checkIfGenerated = async (userId: number) => {
  return await fetch(`${APIs.myRoom}?user_id=${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
}

const createMyRoom = async (selectedModelType: string) => {
  return await fetch(APIs.myRoom, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({ type: selectedModelType }),
  })
}

export default function CreateMyRoom() {
  const [selectedModelType, setSelectedModelType] = useState('R0001')
  const [selectedModel, setSelectedModel] = useState<MyRoomModel>()
  const userId = useUserStore((state) => state.userId)
  const router = useRouter()

  // 마이룸 생성 여부 체크
  useQuery(['checkMyRoom', userId], () => checkIfGenerated(userId), {
    retry: 1,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.info(
          <>
            이미 마이룸을 생성하셨습니다. <br /> 마이룸으로 이동합니다. 🪐
          </>
        )
        router.push(URL.myRoom)
      }
    },
    onError: (error) => {
      console.error('마이룸 정보 조회 오류: ', error)
    },
  })

  const mutation = useMutation(() => createMyRoom(selectedModelType), {
    onSuccess: () => {
      toast.success('마이룸 생성 성공 🪐')
      router.push(URL.myRoom)
    },
    onError: () => {
      toast.error('마이룸 생성 실패 😭')
    },
  })

  useEffect(() => {
    setSelectedModel(
      modelList.find((model) => model.type === selectedModelType)
    )
  }, [selectedModelType])

  const handleCreate = () => {
    mutation.mutate()
  }

  return (
    <Layout>
      <div className={styles.globalContainer}>
        <div className={styles.globalTitle}>마이룸 디자인을 선택해주세요!</div>
        <div className={styles.globalSubTitle}>
          마이룸 별명은 생성 이후 수정할 수 있습니다.
        </div>
        <div className={styles.myRoomPreviewWrapper}>
          <Canvas
            frameloop='demand'
            camera={{ position: selectedModel?.camera }}
          >
            <OrbitControls
              target={selectedModel?.targetOrbit}
              enableZoom={false}
            />
            <ambientLight intensity={1} />
            <group rotation-y={-Math.PI / 2}>{selectedModel?.model}</group>
          </Canvas>
        </div>

        <div className={styles.myRoomList}>
          {modelList.map((model) => (
            <Image className={styles.myRoomThumbnail}
                   key={model.type}
                   src={model.thumbnail}
                   alt='thumbnail'
                   onClick={() => setSelectedModelType(model.type)} />
          ))}
        </div>

        <div className={styles.btnContainer}>
          <button className={styles.createBtn} onClick={handleCreate}>확인</button>
        </div>
      </div>
    </Layout>
  )
}

