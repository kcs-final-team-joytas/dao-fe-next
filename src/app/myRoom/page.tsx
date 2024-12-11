'use client'

import Layout from '@components/Layout'
import { toast } from 'react-toastify'
import { Skeleton } from 'antd'
import { Canvas } from '@react-three/fiber'
import editIcon from '@images/edit.webp'
import closeIcon from '@images/close.webp'
import checkIcon from '@images/check.webp'
import { useState } from 'react'
import { modelList, MyRoomModel, roomConfigs  } from '@components/models/MyRoomModels'
import { APIs, URL } from '@/static'
import LoadingLottie from '@components/lotties/LoadingLottie'
import useUserStore from '@store/userStore'
import { OrbitControls } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Image from 'next/image'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface MyRoomResponse {
  my_room_id: number
  type: string
  my_room_name: string
}

const fetchMyRoomInfo = async (userId: number, router: AppRouterInstance) => {
  const response = await fetch(`${APIs.myRoom}?user_id=${userId}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  })

  if (!response.ok) {
    toast.info('마이룸이 존재하지 않습니다. 생성해주세요! 🪐')
    router.push(URL.createMyRoom)
    throw new Error('Failed to fetch my room info')
  }

  const responseData = await response.json()
  return responseData.data
}

const updateMyRoomName = async (roomId: number, newName: string) => {
  const response = await fetch(`${APIs.myRoom}/${roomId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: JSON.stringify({ room_name: newName }),
  })

  const responseData = await response.json()
  return responseData.data
}

export default function MyRoom() {
  const [myRoomName, setMyRoomName] = useState('')
  const [myRoomNameForChange, setMyRoomNameForChange] = useState('')
  const [myRoomModel, setMyRoomModel] = useState<MyRoomModel>(modelList[0])
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const userId = useUserStore((state) => state.userId)

  const handleNavigate = () => {
    router.push(URL.myRoomObjet)
  }

  const { data: myRoomData, isLoading } = useQuery<MyRoomResponse>(
    ['myRoom', userId],
    () => fetchMyRoomInfo(userId, router),
    {
      retry: 1,
      onSuccess: (data) => {
        setMyRoomName(data.my_room_name)
        setMyRoomNameForChange(data.my_room_name)
        setMyRoomModel(modelList[Number(data.type.split('R000')[1]) - 1])
      },
      onError: () => {
        toast.error('마이룸 정보 조회 실패 😭')
      },
    }
  )

  const mutation = useMutation({
    mutationFn: ({ roomId, newName }: { roomId: number; newName: string }) =>
      updateMyRoomName(roomId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries(['myRoom', userId])
      toast.success('마이룸 이름 수정 성공 🪐')
    },
    onError: () => {
      toast.error('마이룸 이름 수정 실패 😭')
    },
  })

  const handleSubmit = async () => {
    const roomId = myRoomData?.my_room_id

    if (roomId && myRoomNameForChange !== myRoomData.my_room_name) {
      mutation.mutate({ roomId, newName: myRoomNameForChange })
      setIsEditing(false)
    } else {
      toast.info('변경된 사항이 없습니다. 🤔')
      setIsEditing(false)
    }
  }

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
