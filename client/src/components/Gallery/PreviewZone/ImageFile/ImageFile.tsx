import { fileOnClickHandle } from '../../../../redux/features/gallerySlice'
import { useAppDispatch } from '../../../../redux/reduxHooks'
import styles from './ImageFile.module.scss'

interface FileProps {
  originalPath: string
  previewPath: string
  fragmentPreviewPath: string
}
interface Props {
  file: FileProps
  i: number
}
const ImageFile = ({ file, i }: Props) => {
  const dispatch = useAppDispatch()
  const staticPath = import.meta.env.VITE_API_STATIC
  return (
    <div className={styles.imagefile}>
      <div>
        <img
          onClick={() => dispatch(fileOnClickHandle({ file, i }))}
          src={staticPath + file.previewPath}
          alt="picture"
        />
      </div>
    </div>
  )
}

export default ImageFile
