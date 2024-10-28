'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import bell from '@assets/images/bell.webp'
import { URL } from '@/static'
// import Menu from './Menu'
import { Squash as Hamburger } from 'hamburger-react'
import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const RocketLottie = dynamic(
    () => import('@/components/lotties/RocketLottie'),
    { ssr: false }
  )
  return (
    <>
      <div className={styles.headerContainer}>
        <RocketLottie />
        <div className={styles.headerRight}>
          {!pathname.includes('notification') && (
            <Link href={URL.notification} className={styles.icon}>
              <Image alt='' src={bell} className={styles.icon} />
            </Link>
          )}
          <div className={styles.hamburgerIcon}>
            <Hamburger
              toggled={menuOpen}
              toggle={setMenuOpen}
              color='white'
              size={20}
            />
          </div>
        </div>
      </div>
      {/* {menuOpen ? <Menu /> : null} */}
    </>
  )
}
