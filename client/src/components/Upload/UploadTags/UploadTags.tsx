import { useRef, ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import styles from './UploadTags.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/reduxHooks'
import { fetchTags, uploadTags } from '../../../redux/features/gallerySlice'
import { Tag } from '../../../redux/types'

const UploadTags = () => {
  {
    const [newTag, setNewTag] = useState('')
    const [tagsForUpload, setTagsForUpload] = useState<string[]>([])
    const [showTagsFromDb, setShowTagsFromDb] = useState(false)
    const [filteredTagList, setFilteredTagList] = useState<Tag[]>([])

    const tagList = useRef<HTMLDivElement>(null)
    const input = useRef<HTMLInputElement>(null)

    const { tags } = useAppSelector((state) => state.galleryReducer)

    const dispatch = useAppDispatch()

    useEffect(() => {
      dispatch(fetchTags())
    }, [dispatch])

    useEffect(() => {
      if (tags) {
        setFilteredTagList(
          tags.filter((tag) => {
            return tag.title.toLowerCase().includes(newTag.toLowerCase())
          })
        )
      }
    }, [tags, newTag])

    useEffect(() => {
      window.addEventListener('click', clickEvent)
      return () => document.removeEventListener('click', clickEvent)
    }, [])

    const clickEvent = (e: Event) => {
      if (e.target !== tagList.current) {
        setShowTagsFromDb(false)
      }
      if (e.target === input.current) {
        setShowTagsFromDb((state) => !state)
      }
    }

    const addToTagsUpload = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && newTag.length) {
        setTagsForUpload(
          Array.from(new Set([...tagsForUpload, newTag.toLowerCase().trim()]))
        )
        setShowTagsFromDb(false)
        setNewTag('')
      }
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
      setTagsForUpload(tagsForUpload.filter((_, idx) => idx !== index))
    }

    const uploadSelectedTags = async () => {
      if (tagsForUpload.length > 0) {
        dispatch(uploadTags(tagsForUpload))
        setTagsForUpload([])
        dispatch(fetchTags())
      }
    }

    return (
      <div className={styles.uploadtags}>
        <h1>Загрузка тегов</h1>
        <div className={styles.inputZone}>
          <input
            ref={input}
            value={newTag}
            onClick={() => setShowTagsFromDb((state) => !state)}
            onChange={(e) => setNewTagValue(e)}
            onKeyDown={(e) => addToTagsUpload(e)}
            type="text"
          />
          <button onClick={() => uploadSelectedTags()}>Загрузить</button>
          {showTagsFromDb && (
            <div ref={tagList} className={styles.tagsFromDb}>
              {filteredTagList.map((tag) => (
                <div key={tag._id}>{tag.title}</div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.uploadTagsPreview}>
          {tagsForUpload.map((tag, i) => (
            <div key={i} onClick={() => deleteTag(i)}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default UploadTags
