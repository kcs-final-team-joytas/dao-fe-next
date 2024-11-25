import { ChangeEvent } from 'react'
import styles from './ProfileImageUploader.module.css'
import Image from 'next/image'

interface ProfileImageUploaderProps {
  profile: File | null
  profileUrl: string
  imageError: string
  setProfile: (image: File) => void
  setProfileUrl: (image: string) => void
  setImageError: (error: string) => void
}

export default function ProfileImageUploader({
  profileUrl,
  imageError,
  setProfile,
  setProfileUrl,
  setImageError,
}: ProfileImageUploaderProps) {
  const handleChangeProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const maxSizeInMB = 25
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setImageError('파일 크기가 25MB를 초과할 수 없습니다.')
        return
      }

      setProfile(file)

      const reader = new FileReader()
      reader.onload = (data) => {
        if (data.target?.result) {
          setProfileUrl(data.target.result as string)
          setImageError('')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileTitle}>
        프로필 이미지<span style={{ color: 'red' }}>*</span>
      </div>
      <div className={styles.imageContainer}>
        {profileUrl ? (
          <Image className={styles.profile} alt='profile' src={profileUrl} />
        ) : (
          <div className={styles.noProfile} />
        )}
        <div>
          <label className={styles.modifyButton} htmlFor='imageInput'>
            변경
          </label>
          <input
            id='imageInput'
            onChange={handleChangeProfileImage}
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className={styles.redTextLong}>{imageError}</div>
    </div>
  )
}
