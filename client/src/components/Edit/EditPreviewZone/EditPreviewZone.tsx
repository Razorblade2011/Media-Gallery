import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import styles from './EditPreviewZone.module.scss'
import {
  nextModalFile,
  previousModalFile,
  setModalShow,
} from '../../../redux/features/gallerySlice'
import Loading from '../../Loading/Loading'
import EditFile from '../EditFile/EditFile'

const EditPreviewZone = () => {
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
    <div className={styles.editpreviewzone}>
      {isLoading ? (
        <Loading />
      ) : (
        files &&
        files.map((file, i) => {
          return <EditFile key={file._id} file={file} i={i} />
        })
      )}
    </div>
  )
}

export default EditPreviewZone
