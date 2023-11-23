import { logoutUser, setAuth } from '../../../redux/features/authSlice'
import { useAppDispatch } from '../../../redux/reduxHooks'
import styles from './Logout.module.scss'

const Logout = () => {
  const dispatch = useAppDispatch()

  const logoutUserFn = async () => {
    await dispatch(logoutUser())
    dispatch(setAuth(false))
  }

  return (
    <div className={styles.logout}>
      <a onClick={() => logoutUserFn()}>
        <div>Выйти</div>
      </a>
    </div>
  )
}

export default Logout
