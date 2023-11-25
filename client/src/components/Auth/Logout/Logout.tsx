import { logoutUser, setAuthFalse } from '../../../redux/features/authSlice'
import { useAppDispatch } from '../../../redux/reduxHooks'
import styles from './Logout.module.scss'

const Logout = () => {
  const dispatch = useAppDispatch()

  const logoutUserFn = async () => {
    await dispatch(logoutUser())
    dispatch(setAuthFalse())
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
