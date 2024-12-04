import styles from './ObjetDrop.module.css'
import Link from 'next/link'
import { URL, APIs } from '@/static'
import { useRef, useEffect, useState } from 'react'
import { DeleteObjetModal } from '@/components/modal/Modal'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface MenuProps {
  id: number
  loungeId: number | undefined
  isDropVisible: boolean
  setIsDropVisible: (bool: boolean) => void
  imageRef: React.RefObject<HTMLImageElement>
}

export function ObjetDrop({
  id,
  loungeId,
  isDropVisible,
  setIsDropVisible,
  imageRef,
}: MenuProps) {
  const router = useRouter()
  const dropRef = useRef<HTMLDivElement>(null)

  const [isDeleteClick, setIsDeleteClick] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  const deleteObjet = async () => {
    try {
      setIsDeleteClick(true)
      const response = await fetch(`${APIs.objet}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete objet')
      }

      toast.success('오브제 삭제 성공 🪐')
      router.push(loungeId ? `/lounges/${loungeId}` : '/lounges')
    } catch {
      toast.error('오브제 삭제 실패 😭')
    } finally {
      setIsDeleteModalVisible(false)
      setIsDeleteClick(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropVisible &&
        dropRef.current &&
        !dropRef.current.contains(event.target as Node) &&
        imageRef.current !== (event.target as Node)
      ) {
        setIsDropVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropVisible])

  return (
    <div className={styles.container} ref={dropRef}>
      <Link className={styles.tab} href={`${URL.objet}/${id}/update`}>
        수정하기
      </Link>
      <button
        className={styles.tab}
        onClick={() => {
          setIsDeleteModalVisible(true)
          setIsDropVisible(false)
        }}
      >
        삭제하기
      </button>
      <DeleteObjetModal
        isOpen={isDeleteModalVisible}
        isClick={isDeleteClick}
        onClose={() => setIsDeleteModalVisible(false)}
        handleDelete={() => deleteObjet()}
      />
    </div>
  )
}
