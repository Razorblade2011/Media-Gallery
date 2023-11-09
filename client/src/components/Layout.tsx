import Navigation from './Navigation/Navigation'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Copyright © 2023 Razorblade2011</footer>
    </>
  )
}

export default Layout
