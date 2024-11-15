import styles from './GoCommunityBtn.module.css'

interface Props {
  text: string
  className: string
  people?: number
  onClick?: () => void
}

export default function GoCommunityBtn({
  text,
  className,
  people,
  onClick,
}: Props) {
  return (
    <button className={`${styles.communityBtn} ${className}`} onClick={onClick}>
      {text}
      {typeof people === 'number' && <span> ( {people} / 9 )</span>}
    </button>
  )
}
