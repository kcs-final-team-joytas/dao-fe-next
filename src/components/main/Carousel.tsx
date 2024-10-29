'use client'

import dynamic from 'next/dynamic'
import banner1 from '@images/banner/banner1.webp'
import banner2 from '@images/banner/banner2.webp'
import banner3 from '@images/banner/banner3.webp'
import banner4 from '@images/banner/banner4.webp'
import Image from 'next/image'
import styles from './Carousel.module.css'

const Carousel = dynamic(() => import('antd/lib/carousel'), { ssr: false })

export default function CarouselComponent() {
  return (
    <div>
      <Carousel
        arrows
        autoplay
        autoplaySpeed={3500}
        style={{ cursor: 'pointer' }}
      >
        <Image
          priority
          className={styles.bannerImage}
          src={banner1}
          alt='banner1'
        />
        <Image className={styles.bannerImage} src={banner2} alt='banner2' />
        <Image className={styles.bannerImage} src={banner3} alt='banner3' />
        <Image className={styles.bannerImage} src={banner4} alt='banner4' />
      </Carousel>
    </div>
  )
}
