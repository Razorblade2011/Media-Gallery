import styles from './AvatarMenu.module.scss'
import Login from '../../Auth/Login/Login'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import Logout from '../../Auth/Logout/Logout'
import Registration from '../../Auth/Registration/Registration'
import { setShowAvatarMenu } from '../../../redux/features/authSlice'

const AvatarMenu = () => {
  const { isAuth, showRegistraion, showAvatarMenu } = useAppSelector(
    (state) => state.authReducer
  )

  const dispatch = useAppDispatch()

  const changeShowMenu = () => {
    dispatch(setShowAvatarMenu(!showAvatarMenu))
  }

  return (
    <div className={styles.avatarmenu}>
      <img
        src="/static/images/blank.webp"
        alt="blank avatar"
        onClick={changeShowMenu}
      />
      {showAvatarMenu && (
        <div className={styles.menu}>
          {isAuth ? <Logout /> : showRegistraion ? <Registration /> : <Login />}
        </div>
      )}
    </div>
  )
}

export default AvatarMenu
