import { useRef, ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/reduxHooks'
import styles from './TagListPart.module.scss'
import { fetchTags } from '../../../../redux/features/gallerySlice'
import { setFileTags } from '../../../../redux/features/uploadSlice'
import { Tag } from '../../../../redux/types'

const TagListPart = () => {
  const [searchValue, setSearchValue] = useState('')
  const [showTagsList, setShowTagsList] = useState(false)
  const [filteredTagList, setFilteredTagList] = useState<Tag[]>([])

  const tagList = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const { tags } = useAppSelector((state) => state.galleryReducer)
  const { fileTags } = useAppSelector((state) => state.uploadReducer)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTags())
  }, [dispatch])

  useEffect(() => {
    if (tags) {
      setFilteredTagList(
        tags.filter((tag) => {
          return tag.title.toLowerCase().includes(searchValue.toLowerCase())
        })
      )
    }
  }, [tags, searchValue])

  useEffect(() => {
    window.addEventListener('click', clickEvent)
    return () => document.removeEventListener('click', clickEvent)
  }, [])

  const clickEvent = (e: Event) => {
    if (e.target !== tagList.current) {
      setShowTagsList(false)
    }
    if (e.target === input.current) {
      setShowTagsList((state) => !state)
    }
  }

  const setSearchTagValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    if (filteredTagList.length === 0) {
      setShowTagsList(false)
    }
    if (filteredTagList.length > 0) {
      setShowTagsList(true)
    }
  }

  const addTagToUpload = (tag: Tag) => {
    if (!fileTags.includes(tag)) {
      dispatch(setFileTags([...fileTags, tag]))
      setShowTagsList(false)
      setSearchValue('')
    }
  }

  const deleteTag = (id: string) => {
    dispatch(setFileTags(fileTags.filter((tag) => tag._id !== id)))
  }

  return (
    <div className={styles.taglistpart}>
      <h1>Теги</h1>
      <div className={styles.inputZone}>
        <input
          ref={input}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchTagValue(e)}
        />
        {showTagsList && (
          <div ref={tagList} className={styles.tagsList}>
            {filteredTagList.map((tag) => (
              <div onClick={() => addTagToUpload(tag)} key={tag._id}>
                {tag.title}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.uploadTagsPreview}>
        {fileTags.map((tag) => (
          <div
            className={styles.uploadTagPreview}
            key={tag._id}
            onClick={() => deleteTag(tag._id)}
          >
            {tag.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagListPart
