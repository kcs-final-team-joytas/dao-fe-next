import React from 'react'
import styles from './InputItem.module.css'

interface ItemProps {
  label: string
  className?: string
  longtext?: string
  img?: string
  input: JSX.Element
  helperText?: string
}

export default function InputItem({
  label,
  className,
  longtext,
  img,
  input,
  helperText,
}: ItemProps) {
  const inputBoxClasses = `
    ${styles.inputBox}
    ${img ? styles.img : ''}
    ${longtext ? styles.longtext : ''}
  `

  return (
    <div className={styles.itemWrapper}>
      <span className={styles.itemLabel}>
        {label}
        {className !== 'member' && <span className={styles.redText}>*</span>}
      </span>
      <div className={styles.itemInput}>
        <div className={inputBoxClasses}>{input}</div>
        {helperText && <div className={styles.redText}>{helperText}</div>}
      </div>
    </div>
  )
}
