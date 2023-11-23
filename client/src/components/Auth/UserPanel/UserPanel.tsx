import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../../redux/reduxHooks'
import Logout from '../Logout/Logout'
import styles from './UserPanel.module.scss'
import { setShowAvatarMenu } from '../../../redux/features/authSlice'

const UserPanel = () => {
  const dispatch = useAppDispatch()

  const closeMenu = () => {
    dispatch(setShowAvatarMenu(false))
  }

  return (
    <div className={styles.userpanel}>
      <Link to={'/dashboard'} onClick={closeMenu}>
        <div className={styles.profileButton}>Профиль</div>
      </Link>
      <Logout />
    </div>
  )
}

export default UserPanel
