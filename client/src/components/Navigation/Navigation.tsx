import AvatarMenu from './AvatarMenu/AvatarMenu'
import styles from './Navigation.module.scss'
import CustomNavLink from './NavLink/CustomNavLink'

const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <CustomNavLink to="/">Home</CustomNavLink>
      <CustomNavLink to="/gallery">Gallery</CustomNavLink>
      <AvatarMenu />
    </div>
  )
}

export default Navigation
