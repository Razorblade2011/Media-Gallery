import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../redux/reduxHooks'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const RequireAuth = ({ children }: Props) => {
  const location = useLocation()
  const { isAuth } = useAppSelector((state) => state.authReducer)

  if (!isAuth) {
    return <Navigate to={'/'} state={{ from: location }} />
  }

  return children
}

export default RequireAuth
