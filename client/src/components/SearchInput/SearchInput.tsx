import styles from './SearchInput.module.scss'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks'
import {
  fetchMedia,
  fetchTags,
  setSearch,
} from '../../redux/features/gallerySlice'
import { Tag } from '../../redux/types'

const SearchInput = () => {
  const [newTag, setNewTag] = useState<string>('')
  const [tagsForSearch, setTagsForSearch] = useState<Tag[]>([])
  const [showTagsFromDb, setShowTagsFromDb] = useState<boolean>(false)
  const [filteredTagList, setFilteredTagList] = useState<Tag[]>([])

  const tagList = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const tagsFromDb = useAppSelector((state) => state.galleryReducer.tags)

  const dispatch = useAppDispatch()

  useEffect(() => {
    window.addEventListener('click', clickEvent)
    return () => document.removeEventListener('click', clickEvent)
  }, [])

  useEffect(() => {
    dispatch(fetchTags())
  }, [dispatch])

  useEffect(() => {
    if (tagsFromDb) {
      setFilteredTagList(
        tagsFromDb.filter((tag) => {
          return tag.title.toLowerCase().includes(newTag.toLowerCase())
        })
      )
    }
  }, [tagsFromDb, newTag])

  const clickEvent = (e: Event) => {
    if (e.target !== tagList.current) {
      setShowTagsFromDb(false)
    }
    if (e.target === input.current) {
      setShowTagsFromDb((state) => !state)
    }
  }

  const addToTagsUpload = (tag: Tag) => {
    setTagsForSearch(Array.from(new Set([...tagsForSearch, tag])))
    setShowTagsFromDb(false)
    setNewTag('')
  }

  const setNewTagValue = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value)
    if (!filteredTagList.length) {
      setShowTagsFromDb(false)
    }
    if (filteredTagList.length) {
      setShowTagsFromDb(true)
    }
  }

  const deleteTag = (index: number) => {
    setTagsForSearch(tagsForSearch.filter((_, idx) => idx !== index))
  }

  const searchContent = async () => {
    if (tagsForSearch.length > 0) {
      const tagsIds = tagsForSearch
        .map((el) => {
          return el._id
        })
        .join()
      dispatch(setSearch(tagsIds))
    } else {
      dispatch(setSearch(''))
    }
    dispatch(fetchMedia())
  }

  return (
    <div className={styles.searchinput}>
      <div className={styles.inputZone}>
        <input
          ref={input}
          value={newTag}
          onChange={(e) => setNewTagValue(e)}
          type="text"
        />
        <button onClick={() => searchContent()}>Найти</button>
        {showTagsFromDb && (
          <div className={styles.tagsFromDb}>
            {filteredTagList.map((tag) => (
              <div
                onClick={() => {
                  addToTagsUpload(tag)
                }}
                key={tag._id}
              >
                {tag.title}
              </div>
            ))}
          </div>
        )}
      </div>
      <div ref={tagList} className={styles.uploadTagsPreview}>
        {tagsForSearch.map((tag, i) => (
          <div
            className={styles.uploadTagPreview}
            key={i}
            onClick={() => deleteTag(i)}
          >
            {tag.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchInput
