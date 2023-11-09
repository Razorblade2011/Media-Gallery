import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/reduxHooks'
import styles from './AuthorList.module.scss'
import {
  fetchAuthors,
  updateAuthor,
} from '../../../../redux/features/gallerySlice'
import { Author } from '../../../../redux/types'

const AuthorList = () => {
  const [showInput, setShowInput] = useState(false)
  const [_id, set_Id] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const dispatch = useAppDispatch()

  const { authors } = useAppSelector((state) => state.galleryReducer)

  const setAuthorForEdit = (author: Author) => {
    set_Id(author._id)
    setTitle(author.title)
    setDescription(author.description)
    setShowInput(true)
  }

  const applyChanges = async () => {
    if (_id && title && description) {
      setShowInput(false)
      await dispatch(updateAuthor({ _id, title, description }))
      await dispatch(fetchAuthors())
    }
  }

  return (
    <div className={styles.authorlist}>
      {showInput && (
        <div className={styles.inputArea}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Имя автора"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            cols={30}
            rows={10}
            placeholder="Описание"
          ></textarea>
          <div>
            <button onClick={applyChanges}>Обновить</button>
            <button onClick={() => setShowInput(false)}>Закрыть</button>
          </div>
        </div>
      )}
      <h1>Список авторов</h1>
      <div className={styles.list}>
        {authors.map((author) => (
          <div
            key={author._id}
            onClick={() => setAuthorForEdit(author)}
            className={styles.author}
          >
            <div>{author.title}</div>
            <div>{author.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuthorList
