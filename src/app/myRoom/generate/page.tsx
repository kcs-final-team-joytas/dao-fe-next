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

export default function CreateMyRoom() {
  const [selectedModelType, setSelectedModelType] = useState('R0001')
  const [selectedModel, setSelectedModel] = useState<MyRoomModel>()
  const userId = useUserStore((state) => state.userId)
  const router = useRouter()

  const fetchMyRoomInfo = async (userId: number) => {
    try {
      return await fetch(`${APIs.myRoom}?user_id=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('마이룸 정보 조회 오류: ', error)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch(APIs.myRoom, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ type: selectedModelType }),
      })

      if (!response.ok) {
        toast.error('마이룸 생성 실패 😭')
        return
      }

      toast.success('마이룸 생성 성공 🪐')
      router.push(URL.myRoom)
    } catch (error) {
      console.error('마이룸 생성 오류: ', error)
    }
  }

  useEffect(() => {
    // 마이룸 생성 여부를 체크
    const checkIfGenerated = async() => {
      const res = await fetchMyRoomInfo(userId)
      if (res && res.status === 200) {
        toast.info(
          <>
            이미 마이룸을 생성하셨습니다. <br /> 마이룸으로 이동합니다. 🪐
          </>
        )
        router.push(URL.myRoom)
      }
    }
    checkIfGenerated()
  }, [])

  useEffect(() => {
    setSelectedModel(
      modelList.find((model) => model.type === selectedModelType)
    )
  }, [selectedModelType])

  return (
    <Layout>
      <div className={styles.globalContainer}>
        <div className={styles.globalTitle}>마이룸 디자인을 선택해주세요!</div>
        <div className={styles.globalSubTitle}>
          마이룸 별명은 생성 이후 수정할 수 있습니다.
        </div>
        <div className={styles.MyRoomPreviewWrapper}>
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

        <div className={styles.MyRoomList}>
          {modelList.map((model) => (
            <Image className={styles.MyRoomThumbnail}
                   key={model.type}
                   src={model.thumbnail}
                   alt='thumbnail'
                   onClick={() => setSelectedModelType(model.type)} />
          ))}
        </div>

        <div className={styles.BtnContainer}>
          <button className={styles.CreateBtn} onClick={handleCreate}>확인</button>
        </div>
      </div>
    </Layout>
  )
}

