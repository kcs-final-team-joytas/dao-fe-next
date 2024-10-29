'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import bell from '@assets/images/bell.webp'
import { URL } from '@/static'
import styles from './NotiIcon.module.css'

export default function NotiIcon() {
  const pathname = usePathname()
  return (
    !pathname.includes('notification') && (
      <Link href={URL.notification}>
        <Image alt='' src={bell} className={styles.icon} />
      </Link>
    )
  )
}
