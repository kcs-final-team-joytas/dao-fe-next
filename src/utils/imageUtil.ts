import { APIs } from '@/static'
import { toast } from 'react-toastify'

export const convertImageToWebP = (image: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = img.width
        canvas.height = img.height

        if (ctx) {
          ctx.drawImage(img, 0, 0)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Image conversion to WebP failed'))
            },
            'image/webp',
            0.7
          )
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }

      img.onerror = (error) => reject(error)
    }

    reader.onerror = (error) => reject(error)

    reader.readAsDataURL(image)
  })
}

export const uploadProfileImage = async (
  profile: File
): Promise<string | undefined> => {
  if (!profile) {
    throw new Error('Profile image is not selected')
  }

  const webpImage = await convertImageToWebP(profile)
  const { upload_url: uploadUrl, image_url: useUrl } = await getUploadImageUrl()
  console.log(uploadUrl, useUrl)
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/webp',
    },
    credentials: 'include',
    body: webpImage,
  })

  if (!response.ok) {
    throw new Error('Image upload failed')
  }

  return useUrl
}

export const getUploadImageUrl = async (): Promise<{
  upload_url: string
  image_url: string
}> => {
  try {
    const response = await fetch(APIs.uploadImage, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Get upload url failed')
    }
    const responseData = await response.json()
    return responseData.data
  } catch (e) {
    toast.error('이미지 업로드 url 가져오기 실패. 다시 시도해주세요')
    return { upload_url: '', image_url: '' }
  }
}
