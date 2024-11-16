import styles from './ObjetDrop.module.css'

interface MenuProps {
  onClickUpdate: () => void
  onClickDelete: () => void
}

export function ObjetDrop({ onClickUpdate, onClickDelete }: MenuProps) {
  return (
    <div className={styles.container} style={{ marginTop: '10px' }}>
      <button className={styles.tab} onClick={onClickUpdate}>
        수정하기
      </button>
      <button className={styles.tab} onClick={onClickDelete}>
        삭제하기
      </button>
    </div>
  )
}
