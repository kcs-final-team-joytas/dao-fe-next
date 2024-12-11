'use client'

import Layout from '@components/Layout'
import { toast } from 'react-toastify'
import { Skeleton } from 'antd'
import { Canvas } from '@react-three/fiber'
import editIcon from '@images/edit.webp'
import closeIcon from '@images/close.webp'
import checkIcon from '@images/check.webp'
import { useEffect, useState } from 'react'
import { modelList, MyRoomModel, roomConfigs  } from '@components/models/MyRoomModels'
import { APIs, URL } from '@/static'
import LoadingLottie from '@components/lotties/LoadingLottie'
import useUserStore from '@store/userStore'
import { OrbitControls } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Image from 'next/image'

export default function MyRoom() {
  const [myRoomName, setMyRoomName] = useState('')
  const [myRoomNameForChange, setMyRoomNameForChange] = useState('')
  const [myRoomId, setMyRoomId] = useState<number>(0)
  const [myRoomModel, setMyRoomModel] = useState<MyRoomModel>(modelList[0])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const userId = useUserStore((state) => state.userId)

  const fetchMyRoomInfo = async () => {
    try {
      const response = await fetch(`${APIs.myRoom}?user_id=${userId}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      const responseData = await response.json()

      if (!responseData.data) {
        toast.error('마이룸 정보 조회 실패 😭')
        router.push(URL.createMyRoom)
      }

      console.log('마이룸 정보 조회 응답: ', responseData.data)

      setMyRoomName(responseData.data.my_room_name)
      setMyRoomNameForChange(responseData.data.my_room_name)
      setMyRoomId(responseData.data.my_room_id)
      setMyRoomModel(modelList[responseData.data.type.split('R000')[1] - 1])
    } catch (error) {
      console.error('마이룸 정보 조회 오류: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (myRoomNameForChange === myRoomName) {
      toast.info('변경된 사항이 없습니다. 🤔')
      return
    }

    try {
      const response = await fetch(`${APIs.myRoom}/${myRoomId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ room_name: myRoomNameForChange }),
      })

      if (!response.ok) {
        toast.info('마이룸 이름 수정 실패 😭')
        return;
      }

      toast.success('마이룸 이름 수정 성공 🪐')
      setMyRoomName(myRoomNameForChange)
    } catch (error) {
      console.error('마이룸 이름 수정 오류: ', error)
    } finally {
      setIsEditing(false)
    }
  }


  const handleNavigate = () => {
    router.push(URL.myRoomObjet)
  }

  useEffect(() => {
    fetchMyRoomInfo()
  }, [])

  return (
    <Layout>
      <div className={styles.globalContainer}>
        <div className={styles.titleWrapper}>
          {isEditing ? (
            <>
              <input className={styles.myRoomTitleInput}
                value={myRoomNameForChange}
                onChange={(e) => setMyRoomNameForChange(e.target.value)}
                placeholder='마이룸 이름을 입력해주세요'
                minLength={2}
                maxLength={20}
              />
              <div className={styles.myRoomIconContainer}>
                <Image className={styles.iconWithBorder}
                  src={checkIcon}
                  alt='check'
                  onClick={handleSubmit}
                />
                <Image className={styles.iconWithBorder}
                  src={closeIcon}
                  alt='close'
                  onClick={() => setIsEditing(false)}
                />
              </div>
            </>
          ) : (
            <>
              {isLoading ? (
                <Skeleton.Input
                  active
                  style={{
                    backgroundColor: '#b7d1ea',
                    opacity: '70%',
                    width: '220px',
                    height: '24px',
                  }}
                />
              ) : (
                <span className={styles.title}>
                  {myRoomName &&
                  myRoomName?.length > 18
                    ? `${myRoomName.substring(0, 17)}..`
                    : myRoomName}
                </span>
              )}
              <Image className={styles.icon}
                src={editIcon}
                alt='edit'
                onClick={() => setIsEditing(true)}
              />
            </>
          )}
        </div>

        <div className={styles.myRoomPreviewWrapper}>
          {isLoading ? (
            <LoadingLottie />
          ) : (
            <Canvas
              frameloop='demand'
              camera={{
                position: roomConfigs[myRoomModel.type].cameraPosition,
              }}
            >
              <OrbitControls
                target={myRoomModel.targetOrbit}
                enableZoom={false}
              />
              <ambientLight intensity={1} />
              <group
                rotation-y={roomConfigs[myRoomModel.type].rotationY}
                position={roomConfigs[myRoomModel.type].position}
                scale={roomConfigs[myRoomModel.type].scale}
              >
                {myRoomModel.model}
              </group>
            </Canvas>
          )}
        </div>

        <div className={styles.btnWrapper} onClick={handleNavigate}>
          <div>내 오브제 조회</div>
        </div>
        <div style={{ height: '80px' }} />
      </div>
    </Layout>
  )
}
