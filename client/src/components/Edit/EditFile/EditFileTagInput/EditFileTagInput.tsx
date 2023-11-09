import styles from './EditFileTagInput.module.scss'
import { useRef, useEffect, useState, ChangeEvent } from 'react'
import { useAppSelector } from '../../../../redux/reduxHooks'
import { Tag } from '../../../../redux/types'

interface Props {
  tags: Tag[]
  setTags: (t: Tag[]) => void
}

const EditFileTagInput = ({ tags, setTags }: Props) => {
  const [newTag, setNewTag] = useState<string>('')
  const [showTagsFromDb, setShowTagsFromDb] = useState<boolean>(false)
  const [filteredTagList, setFilteredTagList] = useState<Tag[]>([])

  const tagList = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const tagsFromDb = useAppSelector((state) => state.galleryReducer.tags)

  useEffect(() => {
    if (tagsFromDb) {
      setFilteredTagList(
        tagsFromDb.filter((tag) => {
          return tag.title.toLowerCase().includes(newTag.toLowerCase())
        })
      )
    }
  }, [tagsFromDb, newTag])

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

  const addToFileTagsUpload = (tag: Tag) => {
    setTags(Array.from(new Set([...tags, tag])))
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

  return (
    <div className={styles.editfiletaginput}>
      <div className={styles.inputZone}>
        <input
          ref={input}
          value={newTag}
          onClick={() => setShowTagsFromDb((state) => !state)}
          onChange={(e) => setNewTagValue(e)}
          type="text"
        />
        {showTagsFromDb && (
          <div ref={tagList} className={styles.tagsFromDb}>
            {filteredTagList.map((tag) => (
              <div
                onClick={() => {
                  addToFileTagsUpload(tag)
                }}
                key={tag._id}
              >
                {tag.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EditFileTagInput
