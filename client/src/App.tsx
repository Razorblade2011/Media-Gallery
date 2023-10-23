import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import './App.scss'
import HomePage from './pages/HomePage/HomePage'
import Gallery from './pages/Gallery/Gallery'
import Layout from './components/Layout'
import { checkAuth } from './redux/features/authSlice'
import { useAppDispatch } from './redux/reduxHooks'

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
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
