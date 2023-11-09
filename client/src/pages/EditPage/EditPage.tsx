import styles from './EditPage.module.scss'
import { useEffect } from 'react'
import ModalWindow from '../../components/ModalWindow/ModalWindow'
import { useAppSelector } from '../../redux/reduxHooks'
import ModalView from '../../components/Gallery/ModalView/ModalView'
import SearchInput from '../../components/SearchInput/SearchInput'
import EditPreviewZone from '../../components/Edit/EditPreviewZone/EditPreviewZone'
import Pagination from '../../components/Pagination/Pagination'
import SortPanel from '../../components/SortPanel/SortPanel'

const EditPage = () => {
  const { isModalShow } = useAppSelector((state) => state.galleryReducer)

  useEffect(() => {
    isModalShow
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'unset')
  }, [isModalShow])

  return (
    <div className={styles.editpage}>
      <div className={styles.inputZone}>
        <SearchInput />
        <SortPanel />
      </div>
      <Pagination />
      <EditPreviewZone />
      {isModalShow && (
        <ModalWindow>
          <ModalView />
        </ModalWindow>
      )}
      <Pagination />
    </div>
  )
}

export default EditPage
