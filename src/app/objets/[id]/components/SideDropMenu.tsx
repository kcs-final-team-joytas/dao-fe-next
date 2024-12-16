'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import menu from '@images/menu.webp'
import { ObjetDrop } from './ObjetDrop'
import { URL } from '@/static'
import styles from './SideDropMenu.module.css'
import leaveImage from '@images/leave.webp'
import Link from 'next/link'

export default function SideDropMenu({
  id,
  ownerId,
  isChatting,
  isCalling,
  isObjetDetail,
  myUserId,
  isDeleteModalVisible,
  setIsDeleteModalVisible,
}: {
  id: number
  ownerId: string
  isChatting: boolean
  isCalling: boolean
  isObjetDetail: boolean
  myUserId: number
  isDeleteModalVisible: boolean
  setIsDeleteModalVisible: (bool: boolean) => void
}) {
  const imageRef = useRef<HTMLImageElement>(null)

  const isBasic =
    isObjetDetail && !isChatting && !isCalling && myUserId === parseInt(ownerId)
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
          onClick={() => setIsDropVisible((prev) => !prev)}
        />
        {isDropVisible && (
          <ObjetDrop
            id={id}
            isDropVisible={isDropVisible}
            setIsDropVisible={setIsDropVisible}
            imageRef={imageRef}
            isDeleteModalVisible={isDeleteModalVisible}
            setIsDeleteModalVisible={setIsDeleteModalVisible}
          />
        )}
      </div>
    )
  )
}
