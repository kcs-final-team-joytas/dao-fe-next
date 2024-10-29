import Layout from '@/components/Layout'
import styles from './page.module.css'
import recentObjetsIcon from '@images/recentObjets.webp'
import Image from 'next/image'
import PreparingComponent from '@/components/main/PreparingComponent'
import RecentObjets from '@/components/objets/RecentObjets'
import CarouselComponent from '@/components/main/Carousel'

export default function Home() {
  return (
    <Layout>
      <div className={styles.globalContainer}>
        <div className={styles.carouselContainer}>
          <CarouselComponent />
        </div>
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
