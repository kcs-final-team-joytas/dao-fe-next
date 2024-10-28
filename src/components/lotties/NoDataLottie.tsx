'use client'

import Lottie from 'lottie-react'
import noData from '@assets/lotties/noData.json'
import styles from './NoDataLottie.module.css'

export default function NoDataLottie() {
  return (
    <div className={styles.lottieContainer}>
      <Lottie
        animationData={noData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
