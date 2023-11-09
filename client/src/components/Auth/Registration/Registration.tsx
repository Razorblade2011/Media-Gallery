import { useState } from 'react'
import styles from './Registration.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import {
  registerUser,
  setAuthError,
  setShowAvatarMenu,
  setShowRegisration,
} from '../../../redux/features/authSlice'

const Registration = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const { showRegistraion, error } = useAppSelector(
    (state) => state.authReducer
  )

  const dispatch = useAppDispatch()

  const register = async () => {
    if (password !== rePassword) {
      return dispatch(setAuthError('Пароли не совпадают!'))
    }
    await dispatch(registerUser({ email, password }))
    if (!error) {
      return dispatch(setShowAvatarMenu(false))
    }
    return
  }

  const changeView = () => {
    dispatch(setShowRegisration(!showRegistraion))
    dispatch(setAuthError(''))
  }

  return (
    <div className={styles.registration}>
      <div onClick={() => changeView()}>Регистрация</div>
      {error && <div>{error}</div>}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="введите email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="введите пароль"
      />
      <input
        onChange={(e) => setRePassword(e.target.value)}
        value={rePassword}
        type="password"
        placeholder="ещё раз"
      />
      <button onClick={register}>Зарегистрироваться</button>
    </div>
  )
}

export default Registration
