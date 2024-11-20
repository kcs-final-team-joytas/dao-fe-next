import { APIs } from '@/static'

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

  const webpImageBlob = await convertImageToWebP(profile)

  const formData = new FormData()
  formData.append(
    'file',
    new File([webpImageBlob], 'image.webp', { type: 'image/webp' })
  )

  const response = await fetch(APIs.uploadImage, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Image upload failed')
  }

  const data = await response.json()
  return data.data.image_url
}
