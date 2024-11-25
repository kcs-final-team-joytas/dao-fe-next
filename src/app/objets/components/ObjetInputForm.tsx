import { useCallback, useEffect, useState } from 'react'
import InputItem from './InputItem'
import { Tag, Mentions } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import type { MentionsProps } from 'antd'
import { OptionProps } from 'antd/es/mentions'
import { APIs, URL } from '@/static'
import { useRouter } from 'next/navigation'
import useUserStore from '@store/userStore'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { ObjetInfoFormProps, SharedMembersProps } from '@/types/objetProps'
import { uploadImage } from '@/utils/imageUtil'
import {
  validateDescription,
  validateImage,
  validateName,
} from '@utils/validation'
import dynamic from 'next/dynamic'
import styles from './ObjetInputForm.module.css'

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

  const objetId = path === 'create' ? 0 : updateObjetId
  const [loungeId, setLoungeId] = useState(
    path === 'create' ? localStorage.getItem('loungeId') : 0
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

  useEffect(() => {
    if (userList.length === 0) {
      // 전체 멤버 선택했던 경우
      setIsAllSelected(true)
    } else if (sharedMembers.length < userList.length) {
      setIsAllSelected(false)
    }
  }, [sharedMembers, userList])

  const fetchUsers = useCallback(
    async (searchValue: string) => {
      try {
        const response = await fetch(
          `${APIs.loungeList}/${loungeId}/search?nickname=${encodeURIComponent(
            searchValue
          )}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch user list')
        }

        const data = await response.json()
        setUserList(data.data)
      } catch {
        setUserList([])
      }
    },
    [loungeId]
  )

  const onMentionSearch: MentionsProps['onSearch'] = (_, newPrefix) => {
    if (newPrefix) {
      return userList
        .filter((user) => user.nickname.includes(newPrefix))
        .filter(
          (user) =>
            user.user_id !== userId &&
            !sharedMembers.some((member) => member.user_id === user.user_id)
        )
    }
  }

  const onMentionChange = async (value: string) => {
    setMentionValue(value)
    setIsMentionChanged(true)
    if (value.includes('@')) {
      fetchUsers(value.slice(1))
    }
  }

  const onMentionSelect = (option: OptionProps) => {
    if (option.key === 'all') {
      setSharedMembers(userList.filter((user) => user.user_id !== userId))
      setIsAllSelected(true)
    } else {
      setSharedMembers((prevMembers) => [
        ...prevMembers,
        { user_id: Number(option.key), nickname: option.value as string },
      ])
    }
    setMentionValue('')
  }

  const handleTagClose = (removedTag: string) => {
    setSharedMembers((prevMembers) =>
      prevMembers.filter((member) => member.nickname !== removedTag)
    )
    if (originalSharer !== sharedMembers) {
      setIsMentionChanged(true)
    }
  }

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

  const handleUploadClick = () => {
    const fileInput = document.getElementById('objetImage')
    if (fileInput) {
      fileInput.click()
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

  const filteredUsers = isAllSelected
    ? []
    : [
        { value: 'everyone', key: 'all', label: 'everyone' },
        ...userList
          .filter(
            (user) =>
              user.user_id !== userId &&
              !sharedMembers.some((member) => member.user_id === user.user_id)
          )
          .map((user) => ({
            value: user.nickname,
            key: user.user_id.toString(),
            label: user.nickname,
          })),
      ]

  if (isLoading) {
    return <LoadingLottie />
  }

  return (
    <>
      <InputItem
        label='오브제 멤버'
        className='member'
        input={
          <>
            <Mentions
              placeholder='@을 입력해주세요.'
              className={styles.mention}
              onSearch={onMentionSearch}
              onSelect={(option) => onMentionSelect(option as OptionProps)}
              onChange={(value) => onMentionChange(value)}
              value={mentionValue}
              style={{
                minWidth: '50px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                color: 'white',
              }}
              options={filteredUsers}
            />
            <div className={styles.tagWrapper}>
              {sharedMembers.map((member) => (
                <Tag
                  key={member.user_id}
                  closeIcon={<CloseCircleOutlined />}
                  color='white'
                  style={{ color: 'black', alignItems: 'center' }}
                  onClose={() => handleTagClose(member.nickname)}
                >
                  {member.nickname}
                </Tag>
              ))}
            </div>
          </>
        }
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
              className={styles.descriptionInput}
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
        helperText={imageErrorMessage}
      />

      <div
        className={styles.chooseContainer}
        style={{ position: 'absolute', bottom: '0' }}
      >
        {path === 'create' ? (
          <button
            className={styles.generateButton}
            disabled={isClick}
            onClick={handleSubmitForm}
          >
            생성하기
          </button>
        ) : (
          <>
            <button
              className={styles.generateButton}
              onClick={() => router.push(`${URL.objet}/${objetId}`)}
            >
              취소하기
            </button>
            <button
              className={styles.generateButton}
              disabled={isClick}
              onClick={handleSubmitForm}
            >
              수정하기
            </button>
          </>
        )}
      </div>
    </>
  )
}
