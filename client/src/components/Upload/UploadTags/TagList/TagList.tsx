import { deleteTag, fetchTags } from '../../../../redux/features/gallerySlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/reduxHooks'
import styles from './TagList.module.scss'

const TagList = () => {
  const { tags } = useAppSelector((state) => state.galleryReducer)

  const dispatch = useAppDispatch()

  const deleteCurrentTag = (id: string) => {
    dispatch(deleteTag(id))
    dispatch(fetchTags())
  }

  return (
    <div className={styles.taglist}>
      <h3 className={styles.disclaimer}>Удаляйте теги на свой страх и риск!</h3>
      <div className={styles.list}>
        {tags.map((tag) => (
          <div key={tag._id} onClick={() => deleteCurrentTag(tag._id)}>
            {tag.title} {tag.files.length}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagList
