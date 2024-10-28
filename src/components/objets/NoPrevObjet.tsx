import styles from './NoPrevObjet.module.css'

export default function NoPrevObjet() {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerText}>
        <p>앗! 오브제가 없어요 😭</p>
        <p>오브제를 만들어보세요!</p>
      </div>
      {/* <div className={styles.goLoungeButton}>만들러 가기</div> */}
    </div>
  )
}
