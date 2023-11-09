import { useEffect } from 'react'
import {
  nextModalFile,
  previousModalFile,
  setModalShow,
} from '../../../redux/features/gallerySlice'
import ImageFile from './ImageFile/ImageFile'
import styles from './PreviewZone.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import VideoFile from './VideoFile/VideoFile'

const PreviewZone = () => {
  const dispatch = useAppDispatch()

  const { files, isModalShow, isLoading } = useAppSelector(
    (state) => state.galleryReducer
  )

  useEffect(() => {
    if (isModalShow) {
      document.addEventListener('keydown', keydownHandler)
    }
    return () => document.removeEventListener('keydown', keydownHandler)
  })

  const keydownHandler = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        dispatch(setModalShow(false))
        break
      case 'ArrowRight':
        dispatch(nextModalFile())
        break
      case 'ArrowLeft':
        dispatch(previousModalFile())
        break
      default:
    }
  }
  return (
    <div className={styles.previewzone}>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        files &&
        files.map((file, i) => {
          if (file.type === 'image') {
            return <ImageFile key={file._id} file={file} i={i} />
          }
          if (file.type === 'video') {
            return <VideoFile key={file._id} file={file} i={i} />
          }
        })
      )}
    </div>
  )
}

export default PreviewZone
