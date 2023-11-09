import { useAppSelector } from '../../redux/reduxHooks'
import styles from './MessageBox.module.scss'

const MessageBox = () => {
  const { message } = useAppSelector((state) => state.galleryReducer)
  return (
    <div className={styles.messagebox}>
      <div className={styles.messageBox}>
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  )
}

export default MessageBox
