'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileImageUploader from '../components/ProfileImageUploader'
import { checkNicknameDuplicate } from '@utils/validation'
import NicknameInputField from '../components//NicknameInputField'
import useUserStore from '@store/userStore'
import { toast } from 'react-toastify'
import { APIs, URL } from '@/static'
import { uploadImage } from '@utils/imageUtil'
import styles from './page.module.css'

export default function FirstProfile() {
  const [profile, setProfile] = useState<File | null>(null)
  const [profileUrl, setProfileUrl] = useState('')
  const [nickname, setNickname] = useState('')
  const [imageError, setImageError] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [isClick, setIsClick] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  const updateProfileImage = useUserStore((state) => state.updateProfileImage)
  const updateNickname = useUserStore((state) => state.updateNickname)

  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(APIs.profile, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const data = await response.json()
        if (data.data.user_status !== 'ACTIVE_FIRST_LOGIN') {
          toast.info('이미 프로필을 설정했습니다 😊')
          router.back()
        }
      } catch (error) {
        console.error('유저 정보 불러오기 실패: ', error)
      } finally {
        setIsProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  const validateNickname = async (nickname: string): Promise<boolean> => {
    const lengthValid = nickname.length >= 2 && nickname.length <= 10
    const pattern = /^[가-힣a-zA-Z]+$/
    const patternValid = pattern.test(nickname)

    setNicknameError('')

    if (!lengthValid) {
      setNicknameError('닉네임은 최소 2자, 최대 10자여야 합니다.')
      return false
    }

    if (!patternValid) {
      setNicknameError('닉네임은 한글 또는 영문자만 허용됩니다.')
      return false
    }

    const isNicknameDuplicate = await checkNicknameDuplicate(nickname)
    if (isNicknameDuplicate) {
      setNicknameError('중복된 닉네임입니다.')
      return false
    }

    return true
  }

  const updateProfile = async (imageUrl: string) => {
    const response = await fetch(APIs.modifyProfile, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ nickname, profile_url: imageUrl }),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }
  }

  const handleClickStart = async () => {
    if (profile && nickname) {
      setIsClick(true)
      const isValid = await validateNickname(nickname)
      if (isValid) {
        try {
          const uploadedProfileUrl = await uploadImage(profile)
          if (uploadedProfileUrl) {
            await updateProfile(uploadedProfileUrl)
            updateProfileImage(uploadedProfileUrl)
          }
          updateNickname(nickname)
          toast.success('프로필 설정 성공 🪐')
          router.push(URL.main)
        } catch (error) {
          console.error('Error: ', error)
          toast.error('프로필 설정 실패 😭')
        } finally {
          setIsClick(false)
        }
      } else {
        setIsClick(false)
      }
    }
  }

  const isStartButtonDisabled =
    !profile || !nickname || !!nicknameError || isClick

  return (
    <div className={styles.globalContainer}>
      <div className={styles.title}>
        <div>잠깐! </div>
        <div>프로필 설정을 해주세요!</div>
      </div>
      <div className={styles.subTitle}>
        사용하실 이미지와 닉네임을 입력해주세요 ☺️
      </div>
      <ProfileImageUploader
        imageError={imageError}
        profile={profile}
        profileUrl={profileUrl}
        setProfileUrl={setProfileUrl}
        setProfile={setProfile}
        setImageError={setImageError}
      />
      <NicknameInputField
        nickname={nickname}
        nicknameError={nicknameError}
        setNickname={setNickname}
        validateNickname={validateNickname}
      />
      <div className={styles.buttonContainer} onClick={handleClickStart}>
        <button
          className={styles.button}
          disabled={isStartButtonDisabled || isProfileLoading}
        >
          <span>START</span>
        </button>
        <span>START</span>
      </div>
    </div>
  )
}
