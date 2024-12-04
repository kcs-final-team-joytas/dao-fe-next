'use client'

import { useState, useEffect, useRef } from 'react'
import useUserStore from '@store/userStore'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import menu from '@images/menu.webp'
import { ObjetDrop } from './ObjetDrop'
import { APIs, URL } from '@/static'
import styles from './SideDropMenu.module.css'
import leaveImage from '@images/leave.webp'
import Link from 'next/link'

export default function SideDropMenu({
  id,
  ownerId,
  loungeId,
}: {
  id: number
  ownerId: number | undefined
  loungeId: number | undefined
}) {
  const path = usePathname()
  const imageRef = useRef<HTMLImageElement>(null)
  const isObjetDetail = path?.includes('objet')
  const isChatting = path?.includes('chatting')
  const isCalling = path?.includes('call')

  const myUserId = useUserStore((state) => state.userId)

  const isBasic =
    isObjetDetail && !isChatting && !isCalling && myUserId === ownerId
  const isCommunicate = isChatting || isCalling

  const [isDropVisible, setIsDropVisible] = useState(false)

  if (isCommunicate) {
    return (
      <Link href={`${URL.objet}/${id}`}>
        <Image alt='퇴장' className='leave' src={leaveImage} />
      </Link>
    )
  }

  return (
    isBasic && (
      <div className={styles.rightContainer}>
        <Image
          ref={imageRef}
          className={styles.menuIcon}
          src={menu}
          alt='menu'
          onClick={(event) => {
            setIsDropVisible((prev) => !prev)
            event.stopPropagation()
          }}
        />
        {isDropVisible && (
          <ObjetDrop
            id={id}
            loungeId={loungeId}
            isDropVisible={isDropVisible}
            setIsDropVisible={setIsDropVisible}
            imageRef={imageRef}
          />
        )}
      </div>
    )
  )
}
