import styles from './MessageBox.module.scss'

interface Props {
  message: string
}

const MessageBox = ({ message }: Props) => {
  return (
    <div className={styles.messagebox}>
      <div className={styles.messageBox}>
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  )
}

export default MessageBox
