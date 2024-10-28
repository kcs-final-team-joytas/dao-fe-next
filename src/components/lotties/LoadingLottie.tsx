'use client'

import Lottie from 'lottie-react'
import loading from '@assets/lotties/loading.json'
import styles from './LoadingLottie.module.css'

export default function LoadingLottie() {
  return (
    <div className={styles.lottieContainer}>
      <Lottie
        animationData={loading}
        loop={true}
        autoplay={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  )
}
