import styles from './AvatarMenu.module.scss'
import Login from '../../Auth/Login/Login'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { setShowAvatarMenu } from '../../../redux/features/authSlice'
import UserPanel from '../../Auth/UserPanel/UserPanel'
import { useEffect, useRef } from 'react'

const AvatarMenu = () => {
  const { isAuth, user, showAvatarMenu } = useAppSelector(
    (state) => state.authReducer
  )

  const avatar = useRef<HTMLImageElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()

  const staticPath = import.meta.env.VITE_API_STATIC

  const clickEvent = (e: any) => {
    e.stopPropagation()
    if (!showAvatarMenu && e.target === avatar.current) {
      dispatch(setShowAvatarMenu(true))
    }
    if (showAvatarMenu && !menu.current?.contains(e.target)) {
      dispatch(setShowAvatarMenu(false))
    }
  }

  useEffect(() => {
    window.addEventListener('click', clickEvent)
    return () => window.removeEventListener('click', clickEvent)
  }, [clickEvent])

  const avatarSrc = user.avatar
    ? staticPath + user.avatar
    : '/static/images/blank.webp'

  return (
    <div className={styles.avatarmenu}>
      <div className={styles.avatar}>
        <div>{user.email}</div>
        <img src={avatarSrc} alt="blank avatar" ref={avatar} />
      </div>
      {showAvatarMenu && (
        <div className={styles.menu} ref={menu}>
          {isAuth ? <UserPanel /> : <Login />}
        </div>
      )}
    </div>
  )
}

export default AvatarMenu
