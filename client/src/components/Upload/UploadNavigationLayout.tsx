import { Outlet } from 'react-router-dom'
import UploadNavigation from './UploadNavigation/UploadNavigation'

const UploadNavigationLayout = () => {
  return (
    <>
      <UploadNavigation />
      <Outlet />
    </>
  )
}

export default UploadNavigationLayout
