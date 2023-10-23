import { setAuth } from '../../../redux/features/authSlice'
import { useAppDispatch } from '../../../redux/reduxHooks'
import AuthService from '../../../services/AuthService'
import styles from './Logout.module.scss'

const Logout = () => {
  const dispatch = useAppDispatch()

  const logoutUser = async () => {
    await AuthService.logout()
    localStorage.removeItem('token')
    dispatch(setAuth(false))
  }

  return (
    <div className={styles.logout}>
      <button onClick={() => logoutUser()}>Logout</button>
    </div>
  )
}

export default Logout
