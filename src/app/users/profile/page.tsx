'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileImageUploader from '../components/ProfileImageUploader'
import NicknameInputField from '../components/NicknameInputField'
import Layout from '@components/Layout'
import { APIs, URL } from '@/static'
import { checkNicknameDuplicate } from '@utils/validation'
import useUserStore from '@store/userStore'
import { toast } from 'react-toastify'
import styles from './page.module.css'
import { uploadImage } from '@/utils/imageUtil'

export default function Page() {
  const userNickname = useUserStore((state) => state.nickname)
  const userProfileImage = useUserStore((state) => state.profileImage)

  const [profile, setProfile] = useState<File | null>(null)
  const [profileUrl, setProfileUrl] = useState('')
  const [imageError, setImageError] = useState('')
  const [nickname, setNickname] = useState(userNickname)
  const [nicknameError, setNicknameError] = useState('')
  const [isClickUpdate, setIsClickUpdate] = useState(false)

  const updateProfileImage = useUserStore((state) => state.updateProfileImage)
  const updateNickname = useUserStore((state) => state.updateNickname)

  const router = useRouter()

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

    if (nickname !== userNickname) {
      const isNicknameDuplicate = await checkNicknameDuplicate(nickname)
      if (isNicknameDuplicate) {
        setNicknameError('중복된 닉네임입니다.')
        return false
      }
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
    })

    if (!response.ok) {
      throw new Error('Profile update failed')
    }

    return response.json()
  }

  const handleClickConfirm = async () => {
    setIsClickUpdate(true)
    const isValid = await validateNickname(nickname)
    if (isValid) {
      try {
        let imageUrl = profileUrl
        if (profile) {
          const uploadedImageUrl = await uploadImage(profile)
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl
            setProfileUrl(uploadedImageUrl)
          }
        }
        await updateProfile(imageUrl)
        updateProfileImage(imageUrl)
        updateNickname(nickname)
        toast.success('프로필 변경 성공 🪐')
        router.push(URL.main)
      } catch (error) {
        console.error('프로필 변경 실패:', error)
        toast.error('프로필 변경 실패 😭')
      } finally {
        setIsClickUpdate(false)
      }
    } else {
      setIsClickUpdate(false)
    }
  }

  const handleClickDelete = () => {
    router.push(URL.withdraw)
  }

  useEffect(() => {
    setNickname(userNickname)
    setProfileUrl(userProfileImage)
  }, [userNickname, userProfileImage])

  return (
    <Layout>
      <>
        <div className={styles.mainTitle}>프로필 설정</div>
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
        <button
          className={styles.modifyConfirmButton}
          disabled={isClickUpdate}
          onClick={handleClickConfirm}
        >
          수정하기
        </button>
        <div className={styles.deleteButton} onClick={handleClickDelete}>
          회원탈퇴
        </div>
      </>
    </Layout>
  )
}
