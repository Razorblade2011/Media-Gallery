import styles from './SortPanel.module.scss'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks'
import { fetchMedia, setSortAndWay } from '../../redux/features/gallerySlice'

const SortPanel = () => {
  const { sort, way } = useAppSelector((state) => state.galleryReducer)

  const dispatch = useAppDispatch()
  const changeSort = (sort: string, way: number) => {
    dispatch(setSortAndWay({ sort, way }))
    dispatch(fetchMedia())
  }

  return (
    <div className={styles.sortpanel}>
      <div className={styles.bodySection}>
        <div>Сортировка</div>
        <div>
          по дате:
          <div className={styles.buttons}>
            <button
              onClick={() => changeSort('createdAt', -1)}
              className={
                sort === 'createdAt' && way === -1 ? styles.active : ''
              }
            >
              <AiFillCaretDown />
            </button>
            <button
              onClick={() => changeSort('createdAt', 1)}
              className={sort === 'createdAt' && way === 1 ? styles.active : ''}
            >
              <AiFillCaretUp />
            </button>
          </div>
        </div>
        <div>
          по имени:
          <div className={styles.buttons}>
            <button
              onClick={() => changeSort('title', -1)}
              className={sort === 'title' && way === -1 ? styles.active : ''}
            >
              <AiFillCaretDown />
            </button>
            <button
              onClick={() => changeSort('title', 1)}
              className={sort === 'title' && way === 1 ? styles.active : ''}
            >
              <AiFillCaretUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SortPanel
