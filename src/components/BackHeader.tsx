import backImage from '@images/back.webp'
import styles from './BackHeader.module.css'
import { URL } from '@/app/static'
import Link from 'next/link'
import Image from 'next/image'

export default function BackHeader() {
  return (
    <div className={styles.headerDiv}>
      <Link href={URL.login}>
        <Image className={styles.backImg} src={backImage} alt='' />
      </Link>
    </div>
  )
}
