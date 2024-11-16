import Layout from '@components/Layout'
import styles from './page.module.css'
import { Suspense, lazy } from 'react'
import rocket from '@images/rocket.webp'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const LoungeContainer = lazy(() => import('./components/LoungeContainer'))
const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  {
    ssr: false,
  }
)

export default function LoungeListPage() {
  return (
    <Layout>
      <div className={styles.globalContainer32}>
        <div className={styles.globalTitle}>
          <Image
            src={rocket}
            alt='rocket'
            style={{ width: '20px', marginRight: '10px' }}
          />
          추억할 라운지를 보여드릴게요
        </div>
        <div className={styles.globalSubTitle}>
          라운지를 클릭해 입장하거나, 라운지를 생성해보세요!
        </div>
        <div className={styles.globalWidth}>
          <Suspense fallback={<LoadingLottie />}>
            <LoungeContainer />
          </Suspense>
        </div>
      </div>
    </Layout>
  )
}
