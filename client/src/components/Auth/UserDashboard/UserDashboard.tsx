import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { ChangeEvent, useRef, useState } from 'react'
import styles from './UserDashboard.module.scss'
import {
  setAuthError,
  setMessage,
  updateAvatar,
} from '../../../redux/features/authSlice'
import { updatePassword } from '../../../redux/features/authSlice'
import MessageBox from '../../MessageBox/MessageBox'

const UserDashboard = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [reNewPassword, setReNewPassword] = useState('')
  const [newAvatar, setNewAvatar] = useState<File | null>(null)

  const newAvatarRef = useRef<HTMLInputElement>(null)

  const { user, message } = useAppSelector((state) => state.authReducer)

  const dispatch = useAppDispatch()

  const staticPath = import.meta.env.VITE_API_STATIC

  const updateUserPassword = async () => {
    if (newPassword !== reNewPassword) {
      dispatch(setAuthError('Пароли не совпадают'))
    }
    if (!newPassword || !reNewPassword || oldPassword) {
      dispatch(setAuthError('Поля пустые'))
    }
    await dispatch(
      updatePassword({ email: user.email, oldPassword, newPassword })
    )
    setReNewPassword('')
    setNewPassword('')
    setOldPassword('')
    setTimeout(() => dispatch(setMessage('')), 5000)
  }

  const setAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    const selectedFiles = files as FileList
    setNewAvatar(selectedFiles?.[0])
  }

  const saveAvatar = async () => {
    if (newAvatar) {
      await dispatch(updateAvatar(newAvatar))
    }
    setTimeout(() => dispatch(setMessage('')), 5000)
  }

  return (
    <div className={styles.userdashboard}>
      <div className={styles.userName}>
        <div>Имя пользователя:</div>
        <div>{user.name}</div>
      </div>
      <div className={styles.avatar}>
        <div>
          <div>Аватар:</div>
          <button onClick={() => newAvatarRef.current?.click()}>
            Изменить
          </button>
          <input
            ref={newAvatarRef}
            accept="image/*"
            type="file"
            onChange={(e) => setAvatar(e)}
          />
          <button onClick={saveAvatar}>Сохранить</button>
        </div>
        <img
          src={
            newAvatar
              ? URL.createObjectURL(newAvatar)
              : staticPath + user.avatar
          }
        />
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
        <button onClick={updateUserPassword}>Сменить пароль</button>
      </div>
      {message && <MessageBox message={message} />}
    </div>
  )
}

export default UserDashboard
