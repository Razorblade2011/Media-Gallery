import styles from './Pagination.module.scss'
import { useMemo } from 'react'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import {
  setPage,
  setActivePage,
  fetchMedia,
} from '../../redux/features/gallerySlice'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks'

const Pagination = ({ siblingCount = 1 }) => {
  const { page, pageCount, activePage } = useAppSelector(
    (state) => state.galleryReducer
  )

  const DOTS = '...'

  const range = (start: number, end: number) => {
    let length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }

  const dispatch = useAppDispatch()

  const paginationRange = useMemo(() => {
    // Pages count is determined as siblingCount + firstPage + lastPage + activePage + 2*DOTS
    const totalPageNumbers = siblingCount + 5

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..pageCount]
    */
    if (totalPageNumbers >= pageCount) {
      return range(1, pageCount)
    }

    const leftSiblingIndex = Math.max(activePage - siblingCount, 1)
    const rightSiblingIndex = Math.min(activePage + siblingCount, pageCount)

    /*
      We do not want to show dots if there is only one position left
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < pageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = pageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount
      let leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, pageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount
      let rightRange = range(pageCount - rightItemCount + 1, pageCount)
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }
  }, [siblingCount, activePage, pageCount])

  if (activePage === 0 || paginationRange!.length < 2) {
    return null
  }

  const onNext = () => {
    {
      dispatch(setPage(page + 1))
      dispatch(setActivePage(activePage + 1))
      dispatch(fetchMedia())
    }
  }

  const onPrevious = () => {
    {
      dispatch(setPage(page - 1))
      dispatch(setActivePage(activePage - 1))
      dispatch(fetchMedia())
    }
  }

  let lastPage = paginationRange![paginationRange!.length - 1]
  return (
    <ul className={styles.pageNumbersZone}>
      <li
        className={`${styles.page} ${activePage === 1 ? styles.disabled : ''}`}
        onClick={onPrevious}
      >
        <div className={styles.arrow}>
          <AiFillCaretLeft />
        </div>
      </li>
      {paginationRange!.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return (
            <li key={i} className={`${styles.page} ${styles.dots}`}>
              &#8230;
            </li>
          )
        }

        return (
          <li
            key={i}
            className={`${styles.page} ${
              pageNumber === activePage ? styles.selected : ''
            }`}
            onClick={() => {
              dispatch(setPage(pageNumber))
              dispatch(setActivePage(pageNumber))
              dispatch(fetchMedia())
            }}
          >
            {pageNumber}
          </li>
        )
      })}
      <li
        className={`${styles.page} ${
          activePage === lastPage ? styles.disabled : ''
        }`}
        onClick={onNext}
      >
        <div className={styles.arrow}>
          <AiFillCaretRight />
        </div>
      </li>
    </ul>
  )
}

export default Pagination
