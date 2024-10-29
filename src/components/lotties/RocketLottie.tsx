'use client'

import rocket from '@assets/lotties/rocket.json'
import logo from '@assets/images/DAO.webp'
import Image from 'next/image'
import Link from 'next/link'
import { URL } from '@/static'
import styles from './RocketLottie.module.css'
import dynamic from 'next/dynamic'

// Lottie 컴포넌트를 dynamic import로 불러오기
const DynamicLottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function RocketLottie() {
  return (
    <Link href={URL.main} className={styles.logoWrapper}>
      <DynamicLottie
        animationData={rocket}
        loop={true}
        autoplay={true}
        style={{ width: 40, height: 40 }}
      />
      <Image alt='' src={logo} className={styles.logoImage} />
    </Link>
  )
}
