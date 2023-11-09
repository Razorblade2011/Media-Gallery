import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import styles from './UploadPreviewZone.module.scss'
import { setUploadFiles } from '../../../redux/features/uploadSlice'
import PreviewObject from './PreviewObject/PreviewObject'

const UploadPreviewZone = () => {
  const { files } = useAppSelector((state) => state.uploadReducer)

  const dispatch = useAppDispatch()

  const deleteFile = (index: number) => {
    dispatch(setUploadFiles(files.filter((_, i) => i !== index)))
  }

  return (
    <div className={styles.uploadpreviewzone}>
      {files.map((file, i) => (
        <PreviewObject key={i} file={file} i={i} deleteFile={deleteFile} />
      ))}
    </div>
  )
}

export default UploadPreviewZone
