import { useEffect } from 'react'
import PreviewZone from '../../components/Gallery/PreviewZone/PreviewZone'
import ModalWindow from '../../components/ModalWindow/ModalWindow'
import { useAppSelector } from '../../redux/reduxHooks'
import styles from './GalleryPage.module.scss'
import ModalView from '../../components/Gallery/ModalView/ModalView'
import SearchInput from '../../components/SearchInput/SearchInput'
import Pagination from '../../components/Pagination/Pagination'
import SortPanel from '../../components/SortPanel/SortPanel'

const GalleryPage = () => {
  const { isModalShow } = useAppSelector((state) => state.galleryReducer)

  useEffect(() => {
    isModalShow
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'unset')
  }, [isModalShow])

  return (
    <div className={styles.gallerypage}>
      <div className={styles.inputZone}>
        <SearchInput />
        <SortPanel />
      </div>
      <PreviewZone />
      {isModalShow && (
        <ModalWindow>
          <ModalView />
        </ModalWindow>
      )}
      <Pagination />
    </div>
  )
}

export default GalleryPage
