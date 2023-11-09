import { useState } from 'react'
import styles from './VideoFile.module.scss'
import { useAppDispatch } from '../../../../redux/reduxHooks'
import { fileOnClickHandle } from '../../../../redux/features/gallerySlice'

interface FileProps {
  originalPath: string
  previewPath: string
  fragmentPreviewPath: string
}
interface Props {
  file: FileProps
  i: number
}
const VideoFile = ({ i, file }: Props) => {
  const [changeToVideoPreview, setChangeToVideoPreview] = useState(false)

  const dispatch = useAppDispatch()

  const staticPath = import.meta.env.VITE_API_STATIC

  return (
    <div className={styles.main}>
      {changeToVideoPreview ? (
        <div
          onMouseEnter={() => setChangeToVideoPreview(true)}
          onMouseLeave={() => setChangeToVideoPreview(false)}
          onClick={() => dispatch(fileOnClickHandle({ file, i }))}
          className={styles.inlineBlock}
        >
          <video
            src={staticPath + file.fragmentPreviewPath}
            autoPlay
            loop
            muted
          ></video>
        </div>
      ) : (
        <div
          onMouseEnter={() => setChangeToVideoPreview(true)}
          onMouseLeave={() => setChangeToVideoPreview(false)}
          onClick={() => dispatch(fileOnClickHandle({ file, i }))}
          className={styles.inlineBlock}
        >
          <img src={staticPath + file.previewPath} alt="picture" />
        </div>
      )}
    </div>
  )
}

export default VideoFile
