import styles from './ObjetInputButton.module.css'
import Link from 'next/link'
import { URL } from '@/static'

interface ObjetInputButtonProps {
  path: string | undefined
  isClick: boolean
  objetId: number
  handleSubmitForm: () => void
}

export default function ObjetInputButton({
  path,
  isClick,
  objetId,
  handleSubmitForm,
}: ObjetInputButtonProps) {
  return (
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
          <Link
            className={styles.generateButton}
            href={`${URL.objet}/${objetId}`}
          >
            취소하기
          </Link>
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
  )
}
