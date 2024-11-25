'use client'

import { URL } from '@/static'
import useUserStore from '@store/userStore'
import { HomeOutlined, TeamOutlined } from '@ant-design/icons'
import lounge from '@images/footer/lounge.webp'
import loungeDark from '@images/footer/loungeDark.webp'
import styles from './Footer.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const profileImage = useUserStore((state) => state.profileImage) || ''

  return (
    <div className={styles.footerDiv}>
      <Link className={styles.iconDiv} href={URL.main}>
        <HomeOutlined
          style={{
            color: pathname === '/' ? 'white' : '#9a9a9a',
            fontSize: '18px',
          }}
        />
        <div
          className={styles.iconText}
          style={{ color: pathname === '/' ? 'white' : '#9a9a9a' }}
        >
          홈
        </div>
      </Link>
      <Link className={styles.iconDiv} href={URL.lounge}>
        <Image
          alt='아이콘'
          width={22}
          height={22}
          src={
            pathname.includes('lounges') ||
            (!pathname.includes('myRoom') && pathname.includes('objets'))
              ? lounge
              : loungeDark
          }
          className={styles.iconImg}
        />
        <div
          className={styles.iconText}
          style={{
            color:
              pathname.includes('lounges') ||
              (!pathname.includes('myRoom') && pathname.includes('objets'))
                ? 'white'
                : '#9a9a9a',
          }}
        >
          라운지
        </div>
      </Link>
      <Link className={styles.iconDiv} href={URL.users}>
        <TeamOutlined
          style={{
            color: pathname.includes('users') ? 'white' : '#9a9a9a',
            fontSize: '18px',
          }}
        />
        <div
          className={styles.iconText}
          style={{ color: pathname.includes('users') ? 'white' : '#9a9a9a' }}
        >
          유저
        </div>
      </Link>
      <Link className={styles.iconDiv} href={URL.myRoom}>
        <Image
          src={profileImage}
          alt='마이룸'
          width={22}
          height={22}
          className={styles.iconImg}
          style={{
            border: pathname.includes('myRoom') ? '1px solid white' : 'none',
          }}
        />
        <div
          className={styles.iconText}
          style={{ color: pathname.includes('myRoom') ? 'white' : '#9a9a9a' }}
        >
          마이룸
        </div>
      </Link>
    </div>
  )
}
