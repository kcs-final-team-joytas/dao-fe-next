'use client'

import styles from './Header.module.css'
import RocketLottie from '@/components/lotties/RocketLottie'
import NotiIcon from '@/components/header/NotiIcon'
import MenuIcon from '@/components/header/MenuIcon'
import { useState } from 'react'
import Menu from '@components/header/Menu'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className={styles.headerContainer}>
        <RocketLottie />
        <div className={styles.headerRight}>
          <NotiIcon />
          <MenuIcon menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
      </div>

      {menuOpen ? <Menu /> : null}
    </>
  )
}
