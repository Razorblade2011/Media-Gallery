import { Link, useMatch } from 'react-router-dom'
import styles from './CustomNavLink.module.scss'

interface Props {
  children: string
  to: string
}

const CustomNavLink = ({ children, to, ...props }: Props) => {
  const match = useMatch(to)

  return (
    <Link to={to} className={`${match ? styles.active : ''}`} {...props}>
      {children}
    </Link>
  )
}

export default CustomNavLink
