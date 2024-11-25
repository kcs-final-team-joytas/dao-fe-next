import styles from './Menu.module.css'
import { URL, APIs } from '@/static'
import { useRouter } from 'next/navigation'
import useUserStore from '@store/userStore'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { InquiryModal } from '@components/modal/Modal'
import { validateEmail } from '@utils/validation'
import Image from 'next/image'

const logoutRequest = async () => {
  const response = await fetch(APIs.logout, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('로그아웃 실패')
  }

  return response
}

const inquiryRequest = async (email: string, contents: string) => {
  const response = await fetch(`${APIs.userInfo}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
    body: JSON.stringify({ email, contents }),
  })

  if (!response.ok) {
    throw new Error('문의하기 실패')
  }

  return response
}

export default function Menu() {
  const router = useRouter()
  const name = useUserStore((state) => state.nickname)
  const profileImage = useUserStore((state) => state.profileImage)
  const logout = useUserStore((state) => state.logout)
  const [isLogoutClick, setIsLogoutClick] = useState(false)
  const [isLoadingLogout, setIsLoadingLogout] = useState(false)

  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [contents, setContents] = useState('')
  const [isLoadingInquiry, setIsLoadingInquiry] = useState(false)

  const handleClickLogout = async () => {
    setIsLogoutClick(true)
    setIsLoadingLogout(true)
    try {
      await logoutRequest()
      localStorage.removeItem('access_token')
      logout()
      toast.success('로그아웃 성공 😀')
      router.push(URL.login)
    } catch {
      toast.error('로그아웃 실패 😭')
    } finally {
      setIsLoadingLogout(false)
      setIsLogoutClick(false)
    }
  }

  const handleInquiry = async () => {
    if (!validateEmail(email).isValid) {
      toast.error('이메일 형식이 올바르지 않습니다.')
      return
    } else if (!contents) {
      toast.error('문의 내용을 입력해주세요.')
      return
    }

    setIsLoadingInquiry(true)
    try {
      await inquiryRequest(email, contents)
      toast.success('문의하기 성공 😀')
      handleCloseInquiry()
    } catch {
      toast.error('문의하기 실패 😭')
    } finally {
      setIsLoadingInquiry(false)
    }
  }

  const handleCloseInquiry = () => {
    setEmail('')
    setContents('')
    setIsInquiryOpen(false)
  }

  return (
    <>
      <div className={styles.menuContainer}>
        <div className={styles.topContainer}>
          <div className={styles.profileContainer}>
            <Image
              width={44}
              height={44}
              src={profileImage}
              className={styles.profile}
              alt='Profile'
            />
            <div className={styles.nickname}>{name}</div>
          </div>
        </div>
        <div className={styles.categoryList}>
          <button
            className={styles.category}
            onClick={() => router.push(URL.modifyProfile)}
          >
            프로필 설정
          </button>
          <button
            className={styles.category}
            onClick={() => setIsInquiryOpen(true)}
          >
            1:1 문의하기
          </button>

          <button
            className={styles.category}
            disabled={isLogoutClick || isLoadingLogout}
            onClick={handleClickLogout}
          >
            {isLoadingLogout ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </div>

      {isInquiryOpen && (
        <InquiryModal
          isClick={isLoadingInquiry}
          email={email}
          contents={contents}
          setEmail={setEmail}
          setContents={setContents}
          onClose={handleCloseInquiry}
          onConfirm={handleInquiry}
        />
      )}
    </>
  )
}
