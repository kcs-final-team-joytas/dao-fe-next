// import Menu from './Menu'
import styles from './Header.module.css'
import RocketLottie from '@/components/lotties/RocketLottie'
import NotiIcon from '@/components/header/NotiIcon'
import MenuIcon from '@/components/header/MenuIcon'

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <RocketLottie />
      <div className={styles.headerRight}>
        <NotiIcon />
        <MenuIcon />
      </div>
    </div>
  )
}
