'use client'

import { Squash as Hamburger } from 'hamburger-react'
import styles from './MenuIcon.module.css'
import { useState } from 'react'
import Menu from '@components/header/Menu'

export default function MenuIcon() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <div className={styles.hamburgerIcon}>
        <Hamburger
          toggled={menuOpen}
          toggle={setMenuOpen}
          color='white'
          size={20}
        />
      </div>
      {menuOpen ? <Menu /> : null}
    </>
  )
}
