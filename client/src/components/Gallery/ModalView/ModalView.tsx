import { useAppSelector } from '../../../redux/reduxHooks'
import styles from './ModalView.module.scss'

const ModalView = () => {
  const file = useAppSelector((state) => state.galleryReducer.modalObject)

  const staticPath = import.meta.env.VITE_API_STATIC

  return (
    <div className={styles.modalview}>
      {file!.type === 'video' && (
        <video controls src={staticPath + file!.originalPath} />
      )}
      {file!.type === 'image' && (
        <img src={staticPath + file!.originalPath} alt="picture" />
      )}
    </div>
  )
}

export default ModalView
