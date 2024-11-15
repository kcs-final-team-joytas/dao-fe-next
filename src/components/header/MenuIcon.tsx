'use client'

import { Squash as Hamburger } from 'hamburger-react'
import styles from './MenuIcon.module.css'
import { Dispatch, SetStateAction } from 'react'

interface MenuIconProps {
  menuOpen: boolean
  setMenuOpen: Dispatch<SetStateAction<boolean>>
}

export default function MenuIcon({ menuOpen, setMenuOpen }: MenuIconProps) {
  return (
    <div className={styles.hamburgerIcon}>
      <Hamburger
        toggled={menuOpen}
        toggle={setMenuOpen}
        color='white'
        size={20}
      />
    </div>
  )
}
