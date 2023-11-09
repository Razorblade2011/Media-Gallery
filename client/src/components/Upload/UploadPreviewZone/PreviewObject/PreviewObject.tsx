import { useState } from 'react'
import styles from './PreviewObject.module.scss'
import { useAppDispatch, useAppSelector } from '../../../../redux/reduxHooks'
import { setUploadFiles } from '../../../../redux/features/uploadSlice'
import { memo } from 'react'

interface Props {
  file: { file: File; name: string }
  i: number
  deleteFile: (i: number) => void
}

const PreviewObject = ({ file, i, deleteFile }: Props) => {
  const { files } = useAppSelector((state) => state.uploadReducer)

  const [previewName, setPreviewName] = useState(files[i].name)

  const dispatch = useAppDispatch()

  const setFileName = (index: number) => {
    const changedFiles = files.map((f, i) => {
      if (i === index) {
        return { ...f, name: previewName }
      }
      return f
    })
    dispatch(setUploadFiles(changedFiles))
  }

  return (
    <div key={i} className={styles.previewObjectZone}>
      <div className={styles.previewObject}>
        <button onClick={() => deleteFile(i)}>&#10005;</button>
        {file.file.type.split('/')[0] === 'image' && (
          <img src={URL.createObjectURL(file.file)} alt="preview" />
        )}
        {file.file.type.split('/')[0] === 'video' && (
          <video src={URL.createObjectURL(file.file)} />
        )}
      </div>
      <div className={styles.objectNameZone}>
        <div>File name</div>
        <input
          value={previewName}
          onChange={(e) => setPreviewName(e.target.value)}
          className={styles.objectName}
        />
        <button onClick={() => setFileName(i)}>Set name</button>
      </div>
    </div>
  )
}

export default memo(PreviewObject)
