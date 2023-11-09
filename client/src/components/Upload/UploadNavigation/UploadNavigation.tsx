import CustomNavLink from '../../Navigation/NavLink/CustomNavLink'
import styles from './UploadNavigation.module.scss'

const UploadNavigation = () => {
  return (
    <div className={styles.uploadnavigation}>
      <CustomNavLink to="/upload/tags">Загрузка тегов</CustomNavLink>
      <CustomNavLink to="/upload/authors">Загрузка авторов</CustomNavLink>
    </div>
  )
}

export default UploadNavigation
