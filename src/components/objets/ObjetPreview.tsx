'use client'

import styles from './ObjetPreview.module.css'
import { URL } from '@/static'
import { useEffect, useRef, useState } from 'react'
import leftCircle from '@images/leftCircle.webp'
import rightCircle from '@images/rightCircle.webp'
import { useMediaQuery } from '@uidotdev/usehooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ObjetProps {
  objet_id: number
  name: string
  lounge_id: number
  objet_image: string
  description: string
}

interface ObjetPreviewProps {
  objets: ObjetProps[] | undefined
}

export default function ObjetPreview({
  objets,
}: ObjetPreviewProps): JSX.Element | null {
  const listRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState<'left' | 'right'>('right')
  const isMobile = useMediaQuery('only screen and (max-width : 599px)')

  const handleScroll = () => {
    const { current } = listRef
    if (current) {
      if (
        current.scrollLeft <=
        (current.scrollWidth - current.clientWidth) / 2
      ) {
        setScrollState('right')
      } else {
        setScrollState('left')
      }
    }
  }

  useEffect(() => {
    const handleScrollEvent = () => handleScroll()
    const { current } = listRef

    if (current) {
      current.addEventListener('scroll', handleScrollEvent)
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScrollEvent)
      }
    }
  }, [])

  const handleClickRight = () => {
    listRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  const handleClickLeft = () => {
    listRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  if (!objets || objets.length === 0) {
    return null
  }

  return (
    <div className={styles.objetPreviewContainer}>
      <div className={styles.objetList} ref={listRef}>
        {objets.map((objet, index) => (
          <Objet
            image={`${objet.objet_image}?w=150&h=150`}
            title={objet.name}
            description={objet.description}
            key={index}
            objetId={objet.objet_id}
            id={index === 0 ? 'first' : undefined}
          />
        ))}
      </div>

      {objets.length > 3 && !isMobile && (
        <>
          {scrollState === 'right' && (
            <div className={`${styles.iconContainer} ${styles.right}`}>
              <Image
                alt=''
                src={rightCircle}
                className={styles.moveIcon}
                onClick={handleClickRight}
              />
            </div>
          )}
          {scrollState === 'left' && (
            <div className={`${styles.iconContainer} ${styles.left}`}>
              <Image
                alt=''
                src={leftCircle}
                className={styles.moveIcon}
                onClick={handleClickLeft}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Objet({
  image,
  title,
  description,
  objetId,
  id,
}: {
  image: string
  title: string
  description: string
  objetId: number
  id?: string
}) {
  const router = useRouter()

  return (
    <div
      className={styles.objetContainer}
      id={id}
      onClick={() => router.push(`${URL.objet}/${objetId}`)}
    >
      <Image
        src={image}
        priority
        width={100}
        height={100}
        alt={title}
        className={styles.objetImage}
      />
      <div className={styles.objetContent}>
        <div className={styles.objetTitle}>{title}</div>
        <div className={styles.objetDescription}>
          {description.length > 50
            ? description.slice(0, 50) + '...'
            : description}
        </div>
      </div>
    </div>
  )
}
