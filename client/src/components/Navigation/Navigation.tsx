import { useAppSelector } from '../../redux/reduxHooks'
import AvatarMenu from './AvatarMenu/AvatarMenu'
import styles from './Navigation.module.scss'
import CustomNavLink from './NavLink/CustomNavLink'

const Navigation = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer)

  return (
    <nav className={styles.navigation}>
      <CustomNavLink to="/">Домашняя страница</CustomNavLink>
      <CustomNavLink to="/gallery">Галерея</CustomNavLink>
      {isAuth && (
        <>
          <CustomNavLink to="/upload">Загрузка</CustomNavLink>
          <CustomNavLink to="/edit">Редактирование</CustomNavLink>
        </>
      )}
      <AvatarMenu />
    </nav>
  )
}

export default Navigation
