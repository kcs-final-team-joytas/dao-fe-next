import { useRouter } from 'next/navigation'
import { URL, APIs } from '@/static'
import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './UserListItem.module.css'
import PickImg from '@images/pick.webp'
import Image from 'next/image'

interface UserListProps {
  type: string
  user: {
    user_id: number
    nickname: string
    profile_url: string
    user_status?: string
  }
  lounge_id?: number
}

// API 요청 처리 함수
const pokeUser = async (user_id: number) => {
  const response = await fetch(APIs.poke, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
    body: JSON.stringify({ user_id }),
  })

  if (!response.ok) {
    throw new Error('Failed to poke user')
  }

  return response.json()
}

const inviteUser = async (user_id: number, lounge_id: number) => {
  const response = await fetch(APIs.invite, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
    body: JSON.stringify({ user_id, lounge_id }),
  })

  if (!response.ok) {
    throw new Error('Failed to invite user')
  }

  return response.json()
}

export default function UserListItem({ type, user, lounge_id }: UserListProps) {
  const loungeId = lounge_id || 0
  const router = useRouter()
  const [isClick, setIsClick] = useState(false)

  const handleUserClick = () => {
    router.push(`${URL.userDetail}/${user.user_id}`)
  }

  const handleClickPoke = async () => {
    setIsClick(true)
    try {
      await pokeUser(user.user_id)
      toast.success(`${user.nickname} 콕 찌르기 성공 😊`)
    } catch {
      toast.error('콕 찌르기 실패 🥲')
    } finally {
      setIsClick(false)
    }
  }

  const handleClickInvite = async () => {
    setIsClick(true)
    try {
      await inviteUser(user.user_id, Number(loungeId))
      toast.success('유저 초대 성공 😉')
    } catch {
      toast.error('유저 초대 실패 🥲')
    } finally {
      setIsClick(false)
    }
  }

  return (
    <div className={styles.userListItemContainer} key={user.user_id}>
      <div className={styles.profileContainer} onClick={handleUserClick}>
        <div className={styles.profileImageContainer}>
          <Image
            src={user.profile_url}
            alt={user.nickname}
            width={40}
            height={40}
            className={styles.profileImage}
          />
          <div className={styles.profileActive}></div>
        </div>
        <div className={styles.profileNickname}>{user.nickname}</div>
      </div>
      {type === 'lounges' ? (
        <button
          className={styles.inviteButton}
          disabled={isClick}
          onClick={handleClickInvite}
        >
          초대하기
        </button>
      ) : type === 'users' ? (
        <Image
          src={PickImg}
          alt='poke'
          className={styles.icon}
          onClick={handleClickPoke}
        />
      ) : null}
    </div>
  )
}
