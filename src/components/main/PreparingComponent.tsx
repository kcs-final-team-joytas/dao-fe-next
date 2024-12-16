'use client'

import { useRef, useEffect } from 'react'
import styles from './PreparingComponent.module.css'

export default function PreparingComponent() {
  const items = [
    '친구 추가 기능이 추가될 예정이에요!',
    '마이룸 수정 기능이 추가될 예정이에요!',
    '좋아요 기능이 추가될 예정이에요!',
    '라운지 신청 기능이 추가될 예정이에요!',
    '여러 개의 이미지 첨부 기능이 추가될 예정이에요!',
  ]

  const preparingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = preparingRef.current

    const scrollInterval = setInterval(() => {
      if (container) {
        container.scrollLeft += 1

        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth
        ) {
          container.scrollLeft = 0
        }
      }
    }, 20)

    return () => {
      clearInterval(scrollInterval)
    }
  }, [])

  return (
    <div className={styles.preparingContainer} ref={preparingRef}>
      {[...items, ...items].map((item, index) => (
        <div className={styles.preparingItem} key={index}>
          {item}
        </div>
      ))}
    </div>
  )
}
