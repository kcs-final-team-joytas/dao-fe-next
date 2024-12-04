import type { Objet } from '@/types/modelType'
import styles from './MobileLoungeObjets.module.css'
import { useRouter } from 'next/navigation'
import { URL } from '@/static'
import { extractYearMonthDate2 } from '@/utils/formatDatetime'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

const NoDataLottie = dynamic(() => import('@components/lotties/NoDataLottie'), {
  ssr: false,
})

export default function MobileLoungeObjets({
  objets,
  loungeId,
}: {
  objets: Objet[]
  loungeId: number
}) {
  const router = useRouter()

  const handleClickGoObjet = () => {
    if (loungeId === 0) {
      toast.info('라운지를 선택 후 오브제를 생성해주세요 🙂')
      router.push(URL.lounge)
    } else {
      router.push(URL.newObjet)
    }
  }

  if (!objets || objets.length === 0) {
    return (
      <div className={styles.noDataContainer} style={{ marginTop: '50px' }}>
        <NoDataLottie />
        <div className={styles.innerText}>
          <span>오브제가 없습니다 🥲</span>
          <button className={styles.goObjetButton} onClick={handleClickGoObjet}>
            오브제 생성하러 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cardList}>
      {objets.map((objet, index) => (
        <Link
          href={`${URL.objet}/${objet.objet_id}`}
          key={objet.objet_id}
          className={styles.cardContainer}
        >
          <div className={styles.topContainer}>
            <div className={styles.user}>
              <Image
                width={25}
                height={25}
                src={objet.owner?.profile_image || ''}
                alt='profile'
              />
              <div>{objet.owner?.nickname}</div>
            </div>
            <div>
              {objet.created_at && extractYearMonthDate2(objet.created_at)}
            </div>
          </div>
          <div className={styles.objetContainer}>
            <Image
              width={350}
              height={350}
              src={objet.objet_image}
              alt='objet'
            />
            <div>{objet.name}</div>
          </div>
          {index !== objets.length - 1 && <div className={styles.line} />}
        </Link>
      ))}
    </div>
  )
}
