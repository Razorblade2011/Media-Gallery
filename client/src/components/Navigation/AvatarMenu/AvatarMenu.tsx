import { useState } from 'react'
import styles from './AvatarMenu.module.scss'
import Login from '../../Auth/Login/Login'
import { useAppSelector } from '../../../redux/reduxHooks'
import Logout from '../../Auth/Logout/Logout'
import Registration from '../../Auth/Registration/Registration'

const AvatarMenu = () => {
  const [showMenu, setShowMenu] = useState(false)

  const { isAuth, showRegistraion } = useAppSelector(
    (state) => state.authReducer
  )

  const changeShowMenu = () => {
    setShowMenu((state) => !state)
  }

  return (
    <div className={styles.avatarmenu}>
      <img
        src="/static/images/blank.webp"
        alt="blank avatar"
        onClick={changeShowMenu}
      />
      {showMenu && (
        <div className={styles.menu}>
          {isAuth ? <Logout /> : showRegistraion ? <Registration /> : <Login />}
        </div>
      )}
    </div>
  )
}

export default AvatarMenu
