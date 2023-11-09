import styles from './UploadForm.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import DropInput from '../DropInput/DropInput'
import { uploadFiles } from '../../../redux/features/uploadSlice'
import TagListPart from './TagListPart/TagListPart'
import AuthorListPart from './AuthorListPart/AuthorListPart'

const UploadForm = () => {
  const { message, error } = useAppSelector((state) => state.uploadReducer)

  const dispatch = useAppDispatch()

  const uploadFile = async () => {
    await dispatch(uploadFiles({}))
  }

  return (
    <div className={styles.uploadform}>
      <div className={styles.metaInfo}>
        <TagListPart />
        <AuthorListPart />
      </div>
      <div className={styles.dropZone}>
        <DropInput />
      </div>
      <div className={styles.uploadButton}>
        <button onClick={uploadFile}>Загрузить файлы</button>
      </div>
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
    </div>
  )
}

export default UploadForm
