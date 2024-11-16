import { useRouter } from 'next/navigation'
import { URL } from '@/static'
import styles from './LoungeDrop.module.css'
import { useRef, useEffect } from 'react'

export function LoungeDrop({
  id,
  isDrop,
  setIsDrop,
  isOwner,
  setIsDeleteModalVisible,
  setIsWithdrawModalVisible,
}: {
  id: number
  isOwner: boolean
  isDrop: boolean
  setIsDrop: (state: boolean) => void
  setIsDeleteModalVisible: (state: boolean) => void
  setIsWithdrawModalVisible: (state: boolean) => void
}) {
  const router = useRouter()

  const dropRef = useRef<HTMLDivElement>(null)

  const handleClickObjetCreate = () => {
    router.push(URL.newObjet)
  }

  const handleClickDeleteButton = () => {
    setIsDeleteModalVisible(true)
  }

  const handleClickWithdrawButton = () => {
    setIsWithdrawModalVisible(true)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setIsDrop(false)
      }
    }

    if (isDrop) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDrop])

  return (
    <div className={styles.container} ref={dropRef}>
      <button
        className={styles.tab}
        onClick={() => router.push(`${URL.lounge}/${id}/invite`)}
      >
        유저 초대
      </button>
      <button className={styles.tab} onClick={handleClickObjetCreate}>
        오브제 생성
      </button>
      {isOwner ? (
        <button className={styles.tab} onClick={handleClickDeleteButton}>
          라운지 삭제
        </button>
      ) : (
        <button className={styles.tab} onClick={handleClickWithdrawButton}>
          라운지 탈퇴
        </button>
      )}
    </div>
  )
}
