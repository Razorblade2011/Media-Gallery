import { useState } from 'react'
import styles from './Login.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import {
  loginUser,
  setAuthError,
  setShowAvatarMenu,
} from '../../../redux/features/authSlice'
import { Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state) => state.authReducer)

  const login = () => {
    if (!email.length && !password.length) {
      dispatch(setAuthError('Поля пустые'))
    } else if (!email.length) {
      dispatch(setAuthError('Email не заполнен'))
    } else if (!password.length) {
      dispatch(setAuthError('Пароль не может быть пустым'))
    } else {
      dispatch(loginUser({ email, password }))
      dispatch(setShowAvatarMenu(false))
    }
  }

  return (
    <div className={styles.login}>
      <div>Логин</div>
      {error && <div>{error}</div>}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
      />
      <button onClick={login}>Войти</button>
      <Link
        onClick={() => dispatch(setShowAvatarMenu(false))}
        to={'/registration'}
      >
        Регистрация
      </Link>
    </div>
  )
}

export default Login
