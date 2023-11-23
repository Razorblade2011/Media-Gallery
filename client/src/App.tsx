import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import './App.scss'
import HomePage from './pages/HomePage/HomePage'
import GalleryPage from './pages/GalleryPage/GalleryPage'
import Layout from './components/Layout'
import { checkAuth } from './redux/features/authSlice'
import { useAppDispatch } from './redux/reduxHooks'
import UploadMediaPage from './pages/UploadPage/UploadMediaPage'
import UploadNavigationLayout from './components/Upload/UploadNavigationLayout'
import UploadTagsPage from './pages/UploadTagsPage/UploadTagsPage'
import UploadAuthorsPage from './pages/UploadAuthorsPage/UploadAuthorsPage'
import EditPage from './pages/EditPage/EditPage'
import RequireAuth from './hooks/RequireAuth'
import UserDashboardPage from './pages/UserDashboardPage/UserDashboardPage'
import RegistrationPage from './pages/RegistrationPage/RegistrationPage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth())
    }
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route
            path="edit"
            element={
              <RequireAuth>
                <EditPage />
              </RequireAuth>
            }
          />
          <Route
            path="dashboard"
            element={
              <RequireAuth>
                <UserDashboardPage />
              </RequireAuth>
            }
          />
          <Route path="upload" element={<UploadNavigationLayout />}>
            <Route
              index
              element={
                <RequireAuth>
                  <UploadMediaPage />
                </RequireAuth>
              }
            />
            <Route
              path="/upload/tags"
              element={
                <RequireAuth>
                  <UploadTagsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/upload/authors"
              element={
                <RequireAuth>
                  <UploadAuthorsPage />
                </RequireAuth>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
