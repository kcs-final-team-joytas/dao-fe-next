import rocket from '@assets/lotties/rocket.json'
import logo from '@assets/images/DAO.webp'
import Lottie from 'lottie-react'
import Image from 'next/image'
import Link from 'next/link'
import { URL } from '@/static'
import styles from './RocketLottie.module.css'

export default function RocketLottie() {
  return (
    <Link href={URL.main} className={styles.logoWrapper}>
      <Lottie
        animationData={rocket}
        loop={true}
        autoplay={true}
        style={{ width: 40, height: 40 }}
      />
      <Image alt='' src={logo} className={styles.logoImage} />
    </Link>
  )
}
