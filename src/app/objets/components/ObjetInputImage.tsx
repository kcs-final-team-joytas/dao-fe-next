import styles from './ObjetInputImage.module.css'
import Image from 'next/image'
import { validateImage } from '@utils/validation'
import InputItem from './InputItem'

interface ObjetInputImageProps {
  imageUrl: string
  setImage: React.Dispatch<React.SetStateAction<File | null>>
  setImageUrl: React.Dispatch<React.SetStateAction<string>>
  setImageValid: React.Dispatch<React.SetStateAction<boolean>>
  setImageErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setIsImageChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ObjetInputImage({
  imageUrl,
  setImage,
  setImageUrl,
  setImageValid,
  setImageErrorMessage,
  setIsImageChanged,
}: ObjetInputImageProps) {
  const handleUploadClick = () => {
    const fileInput = document.getElementById('objetImage')
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file && validateImage(file).isValid) {
      setImage(file)

      const reader = new FileReader()
      reader.onload = (data) => {
        if (data.target?.result) {
          setImageUrl(data.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      setImageValid(true)
      setImageErrorMessage('')
      setIsImageChanged(true)
    } else if (file) {
      setImageErrorMessage(validateImage(file).errorMessage)
    }
  }

  return (
    <InputItem
      label='오브제 이미지'
      img={'true'}
      input={
        <>
          <label className={styles.imageInputLabel} htmlFor='objetImage'>
            {imageUrl ? (
              <>
                <Image
                  className={styles.imageInput}
                  width={120}
                  height={120}
                  src={imageUrl}
                  alt='profile'
                />
                <div className={styles.imageOverlay}>
                  <span>변경</span>
                </div>
              </>
            ) : (
              <button
                className={styles.uploadButton}
                type='button'
                onClick={handleUploadClick}
              >
                이미지 업로드
              </button>
            )}
          </label>
          <input
            type='file'
            accept='.jpeg, .jpg, .png, .webp'
            id='objetImage'
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </>
      }
    />
  )
}
