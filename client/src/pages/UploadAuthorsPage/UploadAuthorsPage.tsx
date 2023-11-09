import AuthorList from '../../components/Upload/UploadAuthors/AuthorList/AuthorList'
import UploadAuthors from '../../components/Upload/UploadAuthors/UploadAuthors'
import styles from './UploadAuthorsPage.module.scss'

const UploadAuthorsPage = () => {
  return (
    <div className={styles.uploadauthorspage}>
      <UploadAuthors />
      <AuthorList />
    </div>
  )
}

export default UploadAuthorsPage
