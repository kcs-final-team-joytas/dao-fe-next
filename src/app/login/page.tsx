import styles from './page.module.css'
import Link from 'next/link'
import { URL } from '../../static'
import Image from 'next/image'
import logo from '@images/DAO.webp'
import card1 from '@images/card1.png'
import card2 from '@images/card2.png'
import card3 from '@images/card3.png'
import card4 from '@images/card4.png'
import card5 from '@images/card5.png'
import scrollIcon from '@images/scrollIcon.png'

export default function Login() {
  return (
    <div className={styles.main}>
      <div className={styles.topContainer}>
        <div className={styles.gradientOverlay} />
        <video
          autoPlay
          muted
          loop
          playsInline
          src={'/DAO.mp4'}
          className={styles.video}
        />
        <div className={styles.logo}>
          <Image
            src={logo}
            priority
            alt='logo'
            style={{ width: '300px', height: '100px' }}
          />
          <div className={styles.mini}>
            &quotDigital Archive of Our Memories&quot
          </div>
        </div>
        <Link
          href={process.env.NEXT_PUBLIC_KAKAO_AUTH ?? ''}
          className={styles.loginButton}
        >
          카카오 로그인
        </Link>
        <Image alt='' src={scrollIcon} className={styles.scrollIcon} />
        <div className={styles.bottom}>
          <Link href={URL.terms}>
            <div className={styles.text}>이용약관</div>
          </Link>
          <Link href={URL.privacy}>
            <div className={styles.text}>개인정보 처리방침</div>
          </Link>
        </div>
      </div>
      <div className={styles.middleContainer}>
        <div className={styles.containerTitle}>추억을 행성으로.</div>
        <div className={styles.containerSubTitle}>
          3D 모델로 추억을 만들고 우주를 만들어봐요
        </div>
        <Link
          className={styles.cardButton}
          href={process.env.NEXT_KAKAO_AUTH ?? ''}
        >
          탐험하러 가기
        </Link>
        <div className={styles.onBoarding}>
          <div className={styles.cardList}>
            <div className={`${styles.card} ${styles.marginLeft}`}>
              <div className={styles.cardTitle}>원하는 3D 행성을 선택하고</div>
              <Image alt='' src={card1} className={styles.cardImage} />
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                공유하고 싶은 추억을 만들면
              </div>
              <Image alt='' src={card2} className={styles.cardImage} />
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>추억이 우주속에 떠다녀요</div>
              <Image alt='' src={card3} className={styles.cardImage} />
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                같은 추억을 보면서 채팅/통화하면서
              </div>
              <Image alt='' src={card4} className={styles.cardImage} />
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                우리들만의 멋진 우주를 만들어보아요
              </div>
              <Image alt='' src={card5} className={styles.cardImage} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.middleContainer2}>
        <div className={styles.containerTitle}>다르다.</div>
        <div className={styles.cardDescription}>
          달라지는 <strong>기억 보관 방식.</strong> <br />
          DAO는 우리의 추억을 단순한 글이 아닌, <br />
          <strong>3D 행성</strong>으로 시각화하여 우주 속을 탐험합니다. <br />
          <br /> DAO로 여러분은 추억을 <strong>새롭게 체험</strong>합니다.
        </div>
        <Link
          className={styles.cardButton}
          href={process.env.NEXT_KAKAO_AUTH ?? ''}
        >
          체험하러 가기
        </Link>
      </div>
      <div className={styles.bottomContainer}>
        <Image alt='' src={logo} className={styles.bottomLogo} />
        <div>
          <p>joytas.gmail.com</p>
          <p>Copyright ⓒ joytas</p>
        </div>
      </div>
    </div>
  )
}
