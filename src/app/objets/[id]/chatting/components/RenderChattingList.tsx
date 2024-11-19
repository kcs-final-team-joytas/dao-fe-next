import { ChatMessage, AlertUserEnter } from './Chat'
import { CalendarOutlined } from '@ant-design/icons'
import styles from './RenderChattingList.module.css'
import type { Message } from '@/types/messageType'

const groupByDate = (messages: Message[]): Record<string, Message[]> => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.created_at).toLocaleDateString('ko-KR')
    acc[date] = acc[date] || []
    acc[date].push(message)
    return acc
  }, {} as Record<string, Message[]>)
}

export default function RenderChattingList({
  chattingList,
  firstMessageRef,
}: {
  chattingList: Message[]
  firstMessageRef: React.RefObject<HTMLDivElement>
}) {
  const groupedChattings = groupByDate(chattingList)

  const dates = Object.keys(groupedChattings)

  return dates.map((date, index) => {
    return (
      dates.length > 0 && (
        <div className={styles.chattingGroupByDate} key={date}>
          <div className={styles.chattingDate}>
            <CalendarOutlined />
            &nbsp;&nbsp;
            {date}
          </div>
          {groupedChattings[date]
            .slice()
            .map((message: Message, msgIndex) =>
              (message.message && message.type === 'ENTER') ||
              message.type === 'LEAVE' ? (
                <AlertUserEnter message={message.message} key={index} />
              ) : (
                <ChatMessage
                  userName={message.sender_name}
                  userId={message.sender_id}
                  profileImg={message.sender_profile_url}
                  content={message.message}
                  datetime={message.created_at}
                  key={message.id}
                  innerRef={msgIndex === 0 ? firstMessageRef : null}
                />
              )
            )}
        </div>
      )
    )
  })
}
