import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { useState } from 'react'
import styles from './UserDashboard.module.scss'

const UserDashboard = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [reNewPassword, setReNewPassword] = useState('')

  const { user } = useAppSelector((state) => state.authReducer)

  const dispatch = useAppDispatch()

  const updatePassword = async () => {}

  return (
    <div className={styles.userdashboard}>
      <div className={styles.userName}>
        <div>Имя пользователя:</div>
        <div>{user.name}</div>
      </div>
      <div className={styles.email}>
        <div>Адрес почты:</div>
        <div>{user.email}</div>
      </div>
      <div className={styles.changePassword}>
        <div>Сменить пароль</div>
        <input
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Текущий пароль"
          type="text"
        />
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Новый пароль"
          type="text"
        />
        <input
          value={reNewPassword}
          onChange={(e) => setReNewPassword(e.target.value)}
          placeholder="Еще раз"
          type="text"
        />
        <button>Сменить пароль</button>
      </div>
    </div>
  )
}

export default UserDashboard
