import styles from './UploadFileProgressBar.module.scss'
import { useAppSelector } from '../../../redux/reduxHooks'
import { memo } from 'react'

const UploadFileProgressBar = () => {
  const { uploadDone, uploadingProgress, uploading } = useAppSelector(
    (state) => state.uploadReducer
  )

  // const containerStyles = {
  //   height: 20,
  //   width: '100%',
  //   backgroundColor: '#e0e0de',
  //   borderRadius: 50,
  //   margin: 50,
  // }

  // const fillerStyles = {
  //   height: '100%',
  //   width: `${uploadingProgress}%`,
  //   backgroundColor: bgcolor,
  //   borderRadius: 'inherit',
  //   textAlign: 'right',
  // }

  // const labelStyles = {
  //   padding: 5,
  //   color: 'white',
  //   fontWeight: 'bold',
  // }

  return (
    <>
      {uploading && (
        <div className={styles.containerStyles}>
          <div
            className={styles.fillerStyles}
            style={{ width: `${uploadingProgress}%` }}
          >
            <span
              className={styles.labelStyles}
            >{`${uploadingProgress}%`}</span>
          </div>
        </div>
      )}
      {uploadDone && (
        <div className={styles.doneMessage}>Загрузка завершена</div>
      )}
    </>
  )
}

export default memo(UploadFileProgressBar)
