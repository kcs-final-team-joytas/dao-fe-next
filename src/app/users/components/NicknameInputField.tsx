import { ChangeEvent, useEffect, useState } from 'react'
import styles from './NicknameInputField.module.css'

interface NicknameInputFieldProps {
  nickname: string
  nicknameError: string
  setNickname: (nickname: string) => void
  validateNickname: (nickname: string) => Promise<boolean>
}

export default function NicknameInputField({
  nickname,
  nicknameError,
  setNickname,
  validateNickname,
}: NicknameInputFieldProps) {
  const [debouncedNickname, setDebouncedNickname] = useState(nickname)

  useEffect(() => {
    const handler = setTimeout(() => {
      validateNickname(debouncedNickname)
    }, 200)

    return () => {
      clearTimeout(handler)
    }
  }, [validateNickname, debouncedNickname])

  const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newNickname = event.target.value
    setNickname(newNickname)
    setDebouncedNickname(newNickname)
  }

  return (
    <div className={styles.nicknameContainer}>
      <div className={styles.nicknameTitle}>
        닉네임<span style={{ color: 'red' }}>*</span>
      </div>
      <input
        className={styles.nicknameInput}
        placeholder='닉네임을 입력해주세요'
        minLength={2}
        maxLength={10}
        value={nickname}
        onChange={handleNicknameChange}
      />
      <div className={styles.redTextLong}>{nicknameError}</div>
    </div>
  )
}
