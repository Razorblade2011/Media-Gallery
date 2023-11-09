import TagList from '../../components/Upload/UploadTags/TagList/TagList'
import UploadTags from '../../components/Upload/UploadTags/UploadTags'
import styles from './UploadTagsPage.module.scss'

const UploadTagsPage = () => {
  return (
    <div className={styles.uploadtagspage}>
      <UploadTags />
      <TagList />
    </div>
  )
}

export default UploadTagsPage
