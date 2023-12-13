import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import styles from './ModalView.module.scss'
import { setUserVideoVolume } from '../../../redux/features/authSlice'
import { useState } from 'react'

const ModalView = () => {
  const [clearTimer, setClearTimer] = useState(false)
  const file = useAppSelector((state) => state.galleryReducer.modalObject)
  const { isAuth, user } = useAppSelector((state) => state.authReducer)

  const dispatch = useAppDispatch()

  const staticPath = import.meta.env.VITE_API_STATIC

  const onVolumeChange = async (e: any) => {
    // if (!clearTimer) {
    //   setClearTimer(true)
    //   setTimeout(() => {
    dispatch(setUserVideoVolume(e.target.volume as number))
    //     setClearTimer(false)
    //   }, 10000)
    // }
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
