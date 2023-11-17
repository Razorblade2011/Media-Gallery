import { useAppSelector } from '../../../redux/reduxHooks'
import styles from './UserDashboard.module.scss'

const UserDashboard = () => {
  const { user } = useAppSelector((state) => state.authReducer)

  return (
    <div className={styles.userdashboard}>
      <div className={styles.userName}>
        <div>Имя пользователя</div>
        <div>{user.email}</div>
      </div>
      <div className={styles.changePassword}>
        <div>Сменить пароль</div>
        <input placeholder="Текущий пароль" type="text" />
        <input placeholder="Новый пароль" type="text" />
        <input placeholder="Еще раз" type="text" />
        <button>Сменить пароль</button>
      </div>
    </div>
  )
}

export default UserDashboard
