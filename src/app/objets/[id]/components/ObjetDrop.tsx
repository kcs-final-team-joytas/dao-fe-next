'use client'

import styles from './ObjetDrop.module.css'
import Link from 'next/link'
import { URL } from '@/static'
import { useRef, useEffect } from 'react'

interface MenuProps {
  id: number
  isDropVisible: boolean
  setIsDropVisible: (bool: boolean) => void
  imageRef: React.RefObject<HTMLImageElement>
  isDeleteModalVisible: boolean
  setIsDeleteModalVisible: (bool: boolean) => void
}

export function ObjetDrop({
  id,
  isDropVisible,
  setIsDropVisible,
  imageRef,
  isDeleteModalVisible,
  setIsDeleteModalVisible,
}: MenuProps) {
  const dropRef = useRef<HTMLDivElement>(null)

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
          setIsDeleteModalVisible(!isDeleteModalVisible)
          setIsDropVisible(false)
        }}
      >
        삭제하기
      </button>
    </div>
  )
}
