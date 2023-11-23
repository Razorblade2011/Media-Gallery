import { useRef, useState } from 'react'
import styles from './Registration.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { registerUser, setAuthError } from '../../../redux/features/authSlice'
import { useNavigate } from 'react-router-dom'

const Registration = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [avatar, setAvatar] = useState<File>()

  const avatarInput = useRef<HTMLInputElement>(null)

  const { error } = useAppSelector((state) => state.authReducer)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const register = async () => {
    if (password !== rePassword) {
      return dispatch(setAuthError('Пароли не совпадают!'))
    }
    if (avatar) {
      await dispatch(registerUser({ name: userName, avatar, email, password }))
    }
    if (!error) {
      return navigate('/gallery')
    }
    return
  }

  const handleChange = (e: any) => {
    if (e.target.files && e.target.files[0]) setAvatar(e.target.files[0])
  }

  return (
    <div className={styles.registration}>
      <div>Регистрация</div>
      {error && <div>{error}</div>}
      <div>
        <div>Аватарка</div>

        <button onClick={() => avatarInput.current?.click()}>Загрузить</button>
        <input
          onChange={(e) => handleChange(e)}
          className={styles.inputAvatarFile}
          ref={avatarInput}
          type="file"
          accept="image/*"
        />
      </div>
      <div className={styles.avatarPreview}>
        {avatar && <img src={URL.createObjectURL(avatar)} />}
        {avatar && <img src={URL.createObjectURL(avatar)} />}
        {avatar && <img src={URL.createObjectURL(avatar)} />}
      </div>
      <div>
        <div>Имя</div>

        <input
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          type="text"
          placeholder="введите имя"
        />
      </div>
      <div>
        <div>E-Mail</div>
        <input
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          value={email}
          type="email"
          placeholder="введите email"
        />
      </div>
      <div>
        <div>Пароль</div>

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="введите пароль"
        />
      </div>
      <div>
        <div>Повторите пароль</div>
        <input
          onChange={(e) => setRePassword(e.target.value)}
          value={rePassword}
          type="password"
          placeholder="ещё раз"
        />
      </div>
      <button onClick={register}>Зарегистрироваться</button>
    </div>
  )
}

export default Registration
