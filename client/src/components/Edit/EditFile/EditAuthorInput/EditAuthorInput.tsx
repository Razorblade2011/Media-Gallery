import styles from './EditAuthorInput.module.scss'
import { useRef, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/reduxHooks'
import { fetchAuthors } from '../../../../redux/features/gallerySlice'
import { Author } from '../../../../redux/types'

interface Props {
  setAuthor: (author: Author) => void
}

const EditAuthorInput = ({ setAuthor }: Props) => {
  const [inputAuthor, setInputAuthor] = useState('')
  const [showAuthorList, setShowAuthorsList] = useState(false)

  const authorList = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const { authors: authorsList } = useAppSelector(
    (state) => state.galleryReducer
  )

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

  const setCurrentAuthor = (author: Author) => {
    setAuthor(author)
    setShowAuthorsList(false)
    setInputAuthor('')
  }

  const filteredAuthorsList = authorsList.filter((author) => {
    return author.title.includes(inputAuthor)
  })

  return (
    <div className={styles.editauthorinput}>
      <div className={styles.inputZone}>
        <input
          ref={input}
          value={inputAuthor}
          onClick={() => setShowAuthorsList((state) => !state)}
          onChange={(e) => setInputAuthor(e.target.value)}
          type="text"
        />
        {showAuthorList && (
          <div ref={authorList} className={styles.authorsList}>
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
    </div>
  )
}

export default EditAuthorInput
