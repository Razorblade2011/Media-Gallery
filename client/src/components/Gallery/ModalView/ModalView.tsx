import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import styles from './ModalView.module.scss'
import { setUserVideoVolume } from '../../../redux/features/authSlice'

const ModalView = () => {
  const file = useAppSelector((state) => state.galleryReducer.modalObject)
  const { isAuth, user } = useAppSelector((state) => state.authReducer)

  const dispatch = useAppDispatch()

  const staticPath = import.meta.env.VITE_API_STATIC

  let timer: any

  const onVolumeChange = async (e: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      dispatch(setUserVideoVolume(e.target.volume as number))
    }, 7000)
  }

  const setVolume = async (e: any) => {
    isAuth && user.settings
      ? (e.target.volume = user.settings.videoVolume)
      : (e.target.volume = 1)
  }

  return (
    <div className={styles.modalview}>
      {file!.type === 'video' && (
        <video
          onCanPlay={(e) => setVolume(e)}
          controls
          onVolumeChange={(e) => onVolumeChange(e)}
          src={staticPath + file!.originalPath}
        />
      )}
      {file!.type === 'image' && (
        <img src={staticPath + file!.originalPath} alt="picture" />
      )}
    </div>
  )
}

export default ModalView
