import { useRef, useState, memo } from 'react'
import styles from './DropInput.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { setUploadFiles } from '../../../redux/features/uploadSlice'

const DropInput = () => {
  const [dragActive, setDragActive] = useState(false)

  const input = useRef<HTMLInputElement>(null)

  const { files } = useAppSelector((state) => state.uploadReducer)

  const dispatch = useAppDispatch()

  // обработчик для событий перетаскивания
  const handleDrag = function (e: any) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // срабатывает, когда файлы выбирают по через drop
  const handleDrop = function (e: any) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = []
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        newFiles.push({
          name: e.dataTransfer.files[i].name,
          file: e.dataTransfer.files[i],
        })
      }
      dispatch(setUploadFiles([...files, ...newFiles]))
    }
  }

  // срабатывает, когда файлы выбирают по клику
  const handleChange = function (e: any) {
    if (e.target.files && e.target.files[0]) {
      const newFiles = []
      for (let i = 0; i < e.target.files.length; i++) {
        newFiles.push({
          name: e.target.files[i].name,
          file: e.target.files[i],
        })
      }
      dispatch(setUploadFiles([...files, ...newFiles]))
    }
  }

  // срабатывает, когда нажали на кнопку выбора файлов для загрузки
  const onButtonClick = () => {
    input.current?.click()
  }

  return (
    <div className={styles.dropinput}>
      <div className={styles.formFileUpload} onDragEnter={handleDrag}>
        <input
          ref={input}
          type="file"
          className={styles.inputFileUpload}
          multiple={true}
          onChange={handleChange}
        />
        <div
          className={
            dragActive
              ? `${styles.labelFileUpload} ${styles.dragActive}`
              : styles.labelFileUpload
          }
        >
          <div>
            <p>
              {dragActive ? 'Отпусти кнопку' : 'Перенеси свои файлы сюда или'}
            </p>
            <button className={styles.uploadButton} onClick={onButtonClick}>
              Загрузи файлы
            </button>
          </div>
        </div>
        {dragActive && (
          <div
            className={styles.dragFileElement}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </div>
    </div>
  )
}

export default memo(DropInput)
