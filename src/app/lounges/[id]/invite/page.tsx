'use client'

import Layout from '@components/Layout'
import UserListItem from '@components/users/UserListItem'
import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react'
import useUserStore from '@store/userStore'
import { APIs } from '@/static'
import dynamic from 'next/dynamic'
import type { SearchUser } from '@/types/userType'
import { useQuery } from 'react-query'

const LoadingLottie = dynamic(
  () => import('@components/lotties/LoadingLottie'),
  {
    ssr: false,
  }
)

const fetchSearchUsers = async (nickname: string): Promise<SearchUser[]> => {
  const response = await fetch(`${APIs.searchUser}?nickname=${nickname}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()
  return data.data.users
}

export default function Page() {
  const [searchUser, setSearchUser] = useState('')
  const [debouncedSearchUser, setDebouncedSearchUser] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const userId = useUserStore((state) => state.userId)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchUser(searchUser)
    }, 200)

    return () => {
      clearTimeout(handler)
    }
  }, [searchUser])

  const { data: userList = [], isLoading } = useQuery<SearchUser[]>(
    ['searchUser', debouncedSearchUser],
    () => fetchSearchUsers(debouncedSearchUser),
    {
      retry: 1,
      enabled: !!debouncedSearchUser,
      onSuccess: () => {
        setErrorMessage(null)
      },
      onError: (error) => {
        setErrorMessage('유저 검색 실패')
        console.error('유저 검색 실패', error)
      },
    }
  )

  return (
    <Layout>
      <div className={styles.fullContainer}>
        <div className={styles.container}>
          <div className={`${styles.searchTitle} ${styles['lounges']}`}>
            라운지에 초대할 유저를 선택해주세요! 🙌
          </div>
          <input
            ref={searchInputRef}
            value={searchUser}
            placeholder='검색할 유저 닉네임을 입력해주세요!'
            maxLength={10}
            onChange={(e) => setSearchUser(e.target.value)}
            className={styles.searchInput}
          />
          {isLoading ? (
            <LoadingLottie />
          ) : errorMessage ? (
            <div>{errorMessage}</div>
          ) : (
            <div className={styles.userListContainer}>
              {userList.length === 0 || searchUser === '' ? (
                <div className={styles.blankText}>
                  추억을 공유할 <br />
                  유저를 찾아보세요!
                </div>
              ) : (
                userList
                  .filter((user) => user.user_id !== userId)
                  .map((user) => (
                    <UserListItem
                      key={user.user_id}
                      type={'lounges'}
                      user={user}
                    />
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
