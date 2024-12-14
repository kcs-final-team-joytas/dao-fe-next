'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@components/Layout'
import { toast } from 'react-toastify'
import styles from './page.module.css'
import { APIs, URL } from '@/static'
import useUserStore from '@store/userStore'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Vector3, Group, Box3 } from 'three'
import { LoungeModelList } from '@components/models/LazyModelList'
import Image from 'next/image'
import left from '@assets/images/left.webp'
import right from '@assets/images/right.webp'
import { LoungeProps } from '@/types/loungeType'
import { useMutation, useQuery } from 'react-query'

const fetchLoungeList = async (): Promise<LoungeProps[]> => {
  const response = await fetch(APIs.loungeList, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Failed to fetch lounge list')
  }

  const loungeData = await response.json()
  return loungeData.data
}

const createLounge = async (loungeName: string, type: string) => {
  const response = await fetch(APIs.loungeList, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name: loungeName, type }),
  })

  if (!response.ok) {
    throw new Error('Failed to create lounge')
  }

  const responseData = await response.json()
  return responseData.data
}

const CurrentModel = React.memo(({ index }: { index: number }) => {
  return <Model index={index} />
})

CurrentModel.displayName = 'CurrentModel'

export default function NewLounge(): JSX.Element {
  const [loungeName, setLoungeName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(0)
  const [isClick, setIsClick] = useState<boolean>(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const modelTypes = ['L0001', 'L0002', 'L0003']
  const nickname = useUserStore((state) => state.nickname)

  useQuery('lounges', fetchLoungeList, {
    retry: 1,
    onSuccess: (data) => {
      if (data.length >= 4) {
        toast.error('라운지 갯수 제한(최대 4개) 🥹')
        router.push(URL.lounge)
      }
    },
    onError: (error) => {
      toast.error('라운지 목록 조회 실패')
      console.error('Failed to fetch lounge list', error)
    },
  })

  const createMutation = useMutation(
    () => createLounge(loungeName, modelTypes[currentModelIndex]),
    {
      onSuccess: (data) => {
        toast.success('라운지 생성 성공 🪐')
        // queryClient.invalidateQueries('lounges')
        router.push(`${URL.lounge}/${data.lounge_id}`)
      },
      onError: () => {
        toast.error('라운지 생성 실패 😭')
      },
      onSettled: () => {
        setIsClick(false)
      },
    }
  )

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [router])

  const handleLeftClick = (): void => {
    setCurrentModelIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1))
  }

  const handleRightClick = (): void => {
    setCurrentModelIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1))
  }

  const handleChangeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const name = event.target.value
    setLoungeName(name)
    checkLoungeNameValidation(name)
  }

  const handleClickSelect = async (): Promise<void> => {
    setIsClick(true)
    const validation = checkLoungeNameValidation(loungeName)
    if (!validation) return

    createMutation.mutate()
  }

  const checkLoungeNameValidation = (name: string): boolean => {
    const specialCharPattern = /[^\w\s\u3131-\u318E\uAC00-\uD7A3]/
    const consecutiveSpacesPattern = /\s{2,}/

    const hasSpecialChar = specialCharPattern.test(name)
    const hasConsecutiveSpaces = consecutiveSpacesPattern.test(name)

    if (!name) {
      setErrorMessage('라운지 이름을 2~10자로 입력하세요.')
      return false
    } else if (hasSpecialChar) {
      setErrorMessage('특수문자는 사용할 수 없습니다.')
      return false
    } else if (hasConsecutiveSpaces) {
      setErrorMessage('연속된 공백은 사용할 수 없습니다.')
      return false
    } else {
      setErrorMessage('')
      return true
    }
  }

  const memoizedCurrentModel = useMemo(
    () => <CurrentModel index={currentModelIndex} />,
    [currentModelIndex]
  )

  return (
    <Layout>
      <div className={styles.globalContainer32}>
        <div className={styles.globalTitle}>어떤 라운지인가요?</div>
        <div className={styles.globalSubTitle}>라운지 정보를 입력해주세요!</div>
        <div className={styles.container}>
          <div className={styles.inputContainer}>
            <label className={styles.inputTitle}>
              라운지 이름
              <span className={styles.redText}>*</span>
            </label>
            <div className={styles.inputInnerContainer}>
              <input
                ref={inputRef}
                minLength={2}
                maxLength={10}
                className={styles.input}
                placeholder='라운지 이름을 입력하세요.'
                value={loungeName}
                onChange={handleChangeName}
              />
              <div className={styles.redText}>{errorMessage}</div>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputTitle}>라운지 관리자</label>
            <input readOnly className={styles.input} value={nickname} />
          </div>
          <div className={styles.loungeModel}>
            <Canvas
              style={{ width: '100%', height: '100%' }}
              camera={{ position: [0, 0, 4], fov: 50 }}
            >
              <ambientLight intensity={1} />
              {memoizedCurrentModel}
            </Canvas>
          </div>
          <div className={styles.modelIndexText}>
            {currentModelIndex + 1} / 3
          </div>
          <div className={styles.chooseContainer}>
            <Image width={30} alt='left' src={left} onClick={handleLeftClick} />
            <button
              className={styles.chooseButton}
              disabled={isClick}
              onClick={handleClickSelect}
            >
              확인
            </button>
            <Image
              width={30}
              alt='right'
              src={right}
              onClick={handleRightClick}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

function CenterModel({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current)
      const center = box.getCenter(new Vector3())
      ref.current.position.sub(center)
    }
  }, [scene])

  return <group ref={ref}>{children}</group>
}

function Model({ index }: { index: number }) {
  const ref = useRef<Group>(null)
  const modelScale = new Vector3(1, 1, 1)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <group position={new Vector3(0, 0, 0)}>
      <CenterModel>
        <group ref={ref}>
          {index === 0 ? (
            <LoungeModelList.L0001 scale={modelScale} />
          ) : index === 1 ? (
            <LoungeModelList.L0002 scale={modelScale} />
          ) : (
            <LoungeModelList.L0003 scale={modelScale} />
          )}
        </group>
      </CenterModel>
    </group>
  )
}
