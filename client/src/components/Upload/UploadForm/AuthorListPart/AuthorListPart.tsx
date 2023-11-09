import { useRef, useEffect, useState } from 'react'
import styles from './AuthorListPart.module.scss'
import { useAppDispatch, useAppSelector } from '../../../../redux/reduxHooks'
import { fetchAuthors } from '../../../../redux/features/gallerySlice'
import { setAuthor, setMessage } from '../../../../redux/features/uploadSlice'

const AuthorListPart = () => {
  const [inputAuthor, setInputAuthor] = useState('')
  const [showAuthorList, setShowAuthorsList] = useState(false)

  const authorList = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const { authors: authorsList } = useAppSelector(
    (state) => state.galleryReducer
  )
  const { author, message } = useAppSelector((state) => state.uploadReducer)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('click', clickEvent)
    return () => document.removeEventListener('click', clickEvent)
  }, [])

  const clickEvent = (e: Event) => {
    if (e.target !== authorList.current) {
      setShowAuthorsList(false)
    }
    if (e.target === input.current) {
      setShowAuthorsList((state) => !state)
    }
  }

  const setCurrentAuthor = (author: {
    title: string
    description?: string
  }) => {
    dispatch(setAuthor(author))
    dispatch(setMessage(''))
    setShowAuthorsList(false)
    setInputAuthor('')
  }

  const filteredAuthorsList = authorsList.filter((author) => {
    return author.title.includes(inputAuthor)
  })

  return (
    <div className={styles.authorlistpart}>
      <h1>Автор</h1>
      {message && <div>{message}</div>}
      <div className={styles.inputZone}>
        <input
          ref={input}
          value={inputAuthor}
          onClick={() => setShowAuthorsList((state) => !state)}
          onChange={(e) => setInputAuthor(e.target.value)}
          type="text"
        />
        {showAuthorList && (
          <div ref={authorList} className={styles.tagsList}>
            {filteredAuthorsList.map((author) => (
              <div
                onClick={() => {
                  setCurrentAuthor(author)
                }}
                key={author._id}
              >
                {author.title}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.authorForUpload}>
        {author?.title && (
          <div onClick={() => dispatch(setAuthor(''))}>{author.title}</div>
        )}
      </div>
    </div>
  )
}

export default AuthorListPart
