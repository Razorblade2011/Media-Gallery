import { useState } from 'react'
import styles from './Login.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import {
  loginUser,
  setAuthError,
  setShowRegisration,
} from '../../../redux/features/authSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()
  const { showRegistraion, error } = useAppSelector(
    (state) => state.authReducer
  )

  const login = () => {
    dispatch(loginUser({ email, password }))
  }

  const changeView = () => {
    dispatch(setShowRegisration(!showRegistraion))
    dispatch(setAuthError(''))
  }

  return (
    <div className={styles.login}>
      <div onClick={() => changeView()}>Логин</div>
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
    </div>
  )
}

export default Login
