'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import rocket from '@assets/lotties/rocket.json'
import logo from '@assets/images/DAO.webp'
import bell from '@assets/images/bell.webp'
import { URL } from '@/app/static'
// import Menu from './Menu'
import { Squash as Hamburger } from 'hamburger-react'
import Lottie from 'lottie-react'
import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className={styles.headerContainer}>
        <Link href={URL.main} className={styles.logoWrapper}>
          <Lottie
            animationData={rocket}
            loop={true}
            autoplay={true}
            style={{ width: 40, height: 40 }}
          />
          <Image alt='' src={logo} className={styles.logoImage} />
        </Link>
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
