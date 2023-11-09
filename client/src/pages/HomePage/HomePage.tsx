import { useLocation, useNavigate } from 'react-router-dom'
import styles from './HomePage.module.scss'
import { useEffect } from 'react'
import { useAppSelector } from '../../redux/reduxHooks'

const HomePage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { isAuth } = useAppSelector((state) => state.authReducer)

  const fromPage = location.state?.from?.pathname

  useEffect(() => {
    if (isAuth) {
      navigate(fromPage)
    }
  }, [isAuth])

  if (isAuth) {
    return (
      <div className={styles.homepage}>
        <h1>Загружайте, редактируйте и просматривайте файлы</h1>
      </div>
    )
  } else {
    return (
      <div className={styles.homepage}>
        <h1>Залогиньтесь, чтобы загружать и редактировать файлы</h1>
      </div>
    )
  }
}

export default HomePage
