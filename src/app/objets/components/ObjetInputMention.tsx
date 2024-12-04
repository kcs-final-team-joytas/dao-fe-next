import { Tag, Mentions } from 'antd'

import InputItem from './InputItem'
import { CloseCircleOutlined } from '@ant-design/icons'
import styles from './ObjetInputMention.module.css'
import { OptionProps } from 'antd/es/mentions'
import type { MentionsProps } from 'antd'
import { APIs } from '@/static'
import { useCallback, useEffect } from 'react'
import { SharedMembersProps } from '@/types/objetProps'
import useUserStore from '@store/userStore'

interface ObjetInputMentionProps {
  mentionValue: string
  isAllSelected: boolean
  sharedMembers: SharedMembersProps[]
  loungeId: number
  userList: SharedMembersProps[]
  originalSharer: SharedMembersProps[]
  setMentionValue: React.Dispatch<React.SetStateAction<string>>
  setIsAllSelected: React.Dispatch<React.SetStateAction<boolean>>
  setSharedMembers: React.Dispatch<React.SetStateAction<SharedMembersProps[]>>
  setUserList: React.Dispatch<React.SetStateAction<SharedMembersProps[]>>
  setIsMentionChanged: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ObjetInputMention({
  mentionValue,
  isAllSelected,
  userList,
  sharedMembers,
  loungeId,
  originalSharer,
  setUserList,
  setSharedMembers,
  setIsAllSelected,
  setMentionValue,
  setIsMentionChanged,
}: ObjetInputMentionProps) {
  const userId = useUserStore((state) => state.userId)

  useEffect(() => {
    if (userList.length === 0) {
      // 전체 멤버 선택했던 경우
      setIsAllSelected(true)
    } else if (sharedMembers.length < userList.length) {
      setIsAllSelected(false)
    }
  }, [sharedMembers, userList])

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

  return (
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
  )
}
