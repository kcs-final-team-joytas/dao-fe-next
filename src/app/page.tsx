import Layout from '@/components/Layout'
import styles from './page.module.css'
import { Carousel } from 'antd'
import banner1 from '@images/banner/banner1.webp'
import banner2 from '@images/banner/banner2.webp'
import banner3 from '@images/banner/banner3.webp'
import banner4 from '@images/banner/banner4.webp'
import recentObjetsIcon from '@images/recentObjets.webp'
import Image from 'next/image'
import PreparingComponent from '@/components/PreparingComponent'
import RecentObjets from '@/components/objets/RecentObjets'

export default function Home() {
  return (
    <Layout>
      <div className={styles.globalContainer}>
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
        <div className={styles.myObjetContainer}>
          <div className={styles.myObjetTitle}>
            <Image src={recentObjetsIcon} alt='recentObjetsIcon' />
            최근 오브제를 확인해보세요!
          </div>
          <RecentObjets />
          <PreparingComponent />
        </div>
      </div>
    </Layout>
  )
}
