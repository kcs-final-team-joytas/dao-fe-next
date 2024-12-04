import { useEffect, useState } from 'react'
import InputItem from './InputItem'
import { APIs, URL } from '@/static'
import { useRouter } from 'next/navigation'
import useUserStore from '@store/userStore'
import { toast } from 'react-toastify'
import { ObjetInfoFormProps, SharedMembersProps } from '@/types/objetProps'
import { uploadImage } from '@/utils/imageUtil'
import { validateDescription, validateName } from '@utils/validation'
import dynamic from 'next/dynamic'
import ObjetInputMention from './ObjetInputMention'
import ObjetInputImage from './ObjetInputImage'
import ObjetInputButton from './ObjetInputButton'

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  { ssr: false }
)

export default function ObjetInfoForm({
  path,
  type,
  objetInfo,
  updateObjetId,
}: ObjetInfoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const text = path === 'create' ? '오브제 생성' : '오브제 수정'

  const userId = useUserStore((state) => state.userId)

  const objetId = path === 'create' ? 0 : Number(updateObjetId)
  const [loungeId, setLoungeId] = useState(
    path === 'create' ? Number(localStorage.getItem('loungeId')) : 0
  )
  const [userList, setUserList] = useState<SharedMembersProps[]>([])

  const [sharedMembers, setSharedMembers] = useState<SharedMembersProps[]>([])
  const [originalSharer, setOriginalSharer] = useState<SharedMembersProps[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const [nameValid, setNameValid] = useState(false)
  const [descriptionValid, setDescriptionValid] = useState(false)
  const [imageValid, setImageValid] = useState(false)

  const [mentionValue, setMentionValue] = useState('')
  const [isAllSelected, setIsAllSelected] = useState(false)

  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('')
  const [imageErrorMessage, setImageErrorMessage] = useState('')

  const [isMentionChanged, setIsMentionChanged] = useState(
    path === 'create' ? true : false
  )
  const [isNameChanged, setIsNameChanged] = useState(false)
  const [isDescriptionChanged, setIsDescriptionChanged] = useState(false)
  const [isImageChanged, setIsImageChanged] = useState(false)

  useEffect(() => {
    if (objetInfo) {
      const { name, description, objet_image, sharers, lounge_id } = objetInfo
      setOriginalSharer(sharers.filter((user) => user.user_id !== userId))
      setName(name)
      setDescription(description)
      setImageUrl(objet_image)
      if (sharers) {
        setSharedMembers(sharers.filter((user) => user.user_id !== userId))
      }
      setLoungeId(lounge_id)

      setNameValid(true)
      setDescriptionValid(true)
      setImageValid(true)

      if (userList.length === 0) {
        setIsAllSelected(true)
      }
    }
  }, [objetInfo, userId, userList.length])

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'objetName':
        setName(value)

        const nameValidation = validateName(value)
        setNameValid(nameValidation.isValid)
        setNameErrorMessage(nameValidation.errorMessage)

        setIsNameChanged(true)
        break
      case 'objetDescription':
        setDescription(value)

        const descriptionValidation = validateDescription(value)
        setDescriptionValid(descriptionValidation.isValid)
        setDescriptionErrorMessage(descriptionValidation.errorMessage)

        setIsDescriptionChanged(true)
        break
      default:
        break
    }
  }

  const createObjet = async (
    loungeId: number,
    type: string,
    name: string,
    description: string,
    imageUrl: string,
    sharedMembers: SharedMembersProps[]
  ) => {
    try {
      const response = await fetch(APIs.objet, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          lounge_id: Number(loungeId),
          type,
          name,
          description,
          objet_image: imageUrl,
          sharers: sharedMembers.map((member) => member.user_id),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create objet')
      }
      return response
    } catch {
      toast.error('오브제 생성 싪패')
    }
  }

  const updateObjet = async (
    objetId: number,
    name: string,
    description: string,
    imageUrl: string,
    sharedMembers: SharedMembersProps[]
  ) => {
    try {
      const response = await fetch(`${APIs.objet}/${objetId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          objet_image: imageUrl,
          sharers: sharedMembers.map((member) => member.user_id),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update objet')
      }

      return response
    } catch {
      toast.error('오브제 수정 실패')
    }
  }

  const handleSubmitForm = async () => {
    if (name === '') setNameErrorMessage('오브제 이름을 입력해주세요.')
    if (description === '')
      setDescriptionErrorMessage('오브제 설명을 입력해주세요.')
    if (!imageUrl) setImageErrorMessage('오브제 이미지를 첨부해주세요.')
    if (
      !isMentionChanged &&
      !isNameChanged &&
      !isDescriptionChanged &&
      !isImageChanged
    ) {
      if (path === 'update') toast.info('변경된 내용이 없습니다.')
      return
    }
    if (!nameValid || !descriptionValid || !imageValid) return

    setIsClick(true)
    setIsLoading(true)

    try {
      const receivedImageUrl =
        image && isImageChanged ? await uploadImage(image) : imageUrl

      let response
      if (path === 'create') {
        response = await createObjet(
          Number(loungeId),
          type,
          name,
          description,
          receivedImageUrl || '',
          sharedMembers
        )
      } else if (path === 'update') {
        response = await updateObjet(
          Number(objetId),
          name,
          description,
          receivedImageUrl || '',
          sharedMembers
        )
      }

      const responseData = await response?.json()
      console.log(response?.status)
      if (response?.status !== 201 && response?.status !== 200) {
        toast.error(`${text} 실패 😭`)
        return
      }

      toast.success(`${text} 성공 🪐`)
      router.push(`${URL.objet}/${responseData.data.objet_id || objetId}`)
    } catch {
      console.error(`${text} 실패: `)
    } finally {
      setIsLoading(false)
      setIsClick(false)
      localStorage.removeItem('loungeId')
    }
  }

  if (isLoading) {
    return <LoadingLottie />
  }

  return (
    <>
      <ObjetInputMention
        mentionValue={mentionValue}
        isAllSelected={isAllSelected}
        userList={userList}
        sharedMembers={sharedMembers}
        loungeId={loungeId}
        originalSharer={originalSharer}
        setUserList={setUserList}
        setSharedMembers={setSharedMembers}
        setIsAllSelected={setIsAllSelected}
        setMentionValue={setMentionValue}
        setIsMentionChanged={setIsMentionChanged}
      />
      <InputItem
        label='오브제 이름'
        className='name'
        input={
          <input
            type='text'
            value={name}
            placeholder='오브제 이름을 입력해주세요.'
            onChange={(e) => handleInputChange('objetName', e.target.value)}
            minLength={2}
            maxLength={10}
          />
        }
        helperText={nameErrorMessage}
      />
      <InputItem
        label='오브제 설명'
        longtext={'true'}
        input={
          <>
            <textarea
              value={description}
              placeholder='오브제 설명을 입력해주세요.'
              onChange={(e) =>
                handleInputChange('objetDescription', e.target.value)
              }
              minLength={2}
              maxLength={200}
            />
          </>
        }
        helperText={descriptionErrorMessage}
      />
      <ObjetInputImage
        imageUrl={imageUrl}
        setImage={setImage}
        setImageUrl={setImageUrl}
        setImageValid={setImageValid}
        setImageErrorMessage={setImageErrorMessage}
        setIsImageChanged={setIsImageChanged}
      />

      <ObjetInputButton
        path={path}
        isClick={isClick}
        objetId={objetId}
        handleSubmitForm={handleSubmitForm}
      />
    </>
  )
}
