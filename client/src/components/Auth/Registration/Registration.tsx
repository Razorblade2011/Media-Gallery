import { useState } from 'react'
import styles from './Registration.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { registerUser, setAuthError } from '../../../redux/features/authSlice'
import { useNavigate } from 'react-router-dom'

const Registration = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const { error } = useAppSelector((state) => state.authReducer)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const register = async () => {
    if (password !== rePassword) {
      return dispatch(setAuthError('Пароли не совпадают!'))
    }
    await dispatch(registerUser({ name: userName, email, password }))
    if (!error) {
      return navigate('/gallery')
    }
    return
  }

  return (
    <div className={styles.registration}>
      <div>Регистрация</div>
      {error && <div>{error}</div>}
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
