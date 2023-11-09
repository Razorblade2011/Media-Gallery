import { useRef, ChangeEvent, useEffect, useState } from 'react'
import styles from './UploadAuthors.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import {
  fetchAuthors,
  uploadAuthor,
} from '../../../redux/features/gallerySlice'
import { Author } from '../../../redux/types'

const UploadAuthors = () => {
  const [authorName, setAuthorName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [showAuthorsList, setShowAuthorsList] = useState<boolean>(false)
  const [filteredNameList, setFilteredNameList] = useState<Author[]>([])

  const authorList = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const { authors } = useAppSelector((state) => state.galleryReducer)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  useEffect(() => {
    if (authors) {
      setFilteredNameList(
        authors.filter((author) => {
          return author.title.toLowerCase().includes(authorName.toLowerCase())
        })
      )
    }
  }, [authors, authorName])

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

  const setNewAuthorName = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value)
    if (!filteredNameList.length) {
      setShowAuthorsList(false)
    }
    if (filteredNameList.length) {
      setShowAuthorsList(true)
    }
  }

  const uploadedAuthor = async () => {
    if (authorName) {
      if (!description) setDescription('Описание.')
      const res = await dispatch(
        uploadAuthor({ title: authorName, description })
      )
      setAuthorName('')
      setDescription('')
      dispatch(fetchAuthors())
      console.log(res)
    }
  }

  const selectAuthor = () => {}

  return (
    <div className={styles.uploadauthors}>
      <h1>Загрузка авторов</h1>
      <div className={styles.inputArea}>
        <div className={styles.submit}>
          <input
            ref={input}
            value={authorName}
            placeholder="Имя автора"
            onChange={(e) => setNewAuthorName(e)}
            onClick={() => setShowAuthorsList((state) => !state)}
            type="text"
          />
          <button onClick={() => uploadedAuthor()}>Загрузить</button>
          {showAuthorsList && (
            <div ref={authorList} className={styles.authorsNames}>
              {filteredNameList.map((el) => (
                <div key={el._id} onClick={selectAuthor}>
                  {el.title}
                </div>
              ))}
            </div>
          )}
        </div>
        <textarea
          value={description}
          placeholder="Описание"
          onChange={(e) => setDescription(e.target.value)}
          cols={33}
          rows={10}
        ></textarea>
      </div>
    </div>
  )
}

export default UploadAuthors
