import UploadFileProgressBar from '../../components/Upload/UploadFileProgressBar/UploadFileProgressBar'
import UploadForm from '../../components/Upload/UploadForm/UploadForm'
import UploadPreviewZone from '../../components/Upload/UploadPreviewZone/UploadPreviewZone'
import styles from './UploadMediaPage.module.scss'

const UploadMediaPage = () => {
  return (
    <div className={styles.uploadmediapage}>
      <UploadForm />
      <UploadPreviewZone />
      <UploadFileProgressBar />
    </div>
  )
}

export default UploadMediaPage
