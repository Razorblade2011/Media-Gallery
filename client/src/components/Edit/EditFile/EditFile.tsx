import { useState } from 'react'
import styles from './EditFile.module.scss'
import { useAppDispatch } from '../../../redux/reduxHooks'
import {
  FileI,
  deleteMedia,
  fetchMedia,
  fileOnClickHandle,
  updateMedia,
} from '../../../redux/features/gallerySlice'
import EditFileTagInput from './EditFileTagInput/EditFileTagInput'
import EditAuthorInput from './EditAuthorInput/EditAuthorInput'
import { Tag } from '../../../redux/types'

interface Props {
  file: FileI
  i: number
}
const EditFile = ({ i, file }: Props) => {
  const [fileTags, setFileTags] = useState(file.tags)
  const [changeToVideoPreview, setChangeToVideoPreview] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [author, setAuthor] = useState(file.author)

  const dispatch = useAppDispatch()

  const staticPath = import.meta.env.VITE_API_STATIC

  const deleteMediaFile = async (id: string, title: string) => {
    await dispatch(deleteMedia({ id, title }))
    await dispatch(fetchMedia())
  }

  const removeTag = (tag: Tag) => {
    setFileTags(fileTags.filter((t) => t._id !== tag._id))
  }

  const submitFileChanges = async (mediaId: string) => {
    const tagsIds = fileTags.map((tag) => tag._id)
    await dispatch(
      updateMedia({
        mediaId,
        newMediaTitle: newFileName,
        newMediaAuthor: author._id,
        tagsIds: tagsIds,
      })
    )
    await dispatch(fetchMedia())
  }

  return (
    <div className={styles.editfile}>
      <div className={styles.inlineBlock}>
        <div className={styles.preview}>
          {file.type === 'video' ? (
            changeToVideoPreview ? (
              <video
                src={staticPath + file.fragmentPreviewPath}
                autoPlay
                loop
                muted
                onMouseEnter={() => setChangeToVideoPreview(true)}
                onMouseLeave={() => setChangeToVideoPreview(false)}
                onClick={() => dispatch(fileOnClickHandle({ file, i }))}
              />
            ) : (
              <img
                src={staticPath + file.previewPath}
                alt="picture"
                onMouseEnter={() => setChangeToVideoPreview(true)}
                onMouseLeave={() => setChangeToVideoPreview(false)}
                onClick={() => dispatch(fileOnClickHandle({ file, i }))}
              />
            )
          ) : (
            <img
              onClick={() => dispatch(fileOnClickHandle({ file, i }))}
              src={staticPath + file.previewPath}
              alt="picture"
            />
          )}
        </div>
        <div className={styles.fileName}>
          <div>Имя файла</div>
          <div>{file.title}</div>
          <input
            type="text"
            placeholder="Новое имя"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </div>
        <div className={styles.fileAuthor}>
          <div>Автор</div>
          <div>{author.title}</div>
          <EditAuthorInput setAuthor={setAuthor} />
        </div>
        <div className={styles.tagsZone}>
          <div>Теги</div>
          <EditFileTagInput tags={fileTags} setTags={setFileTags} />
          <div className={styles.fileTags}>
            {fileTags.map((tag) => (
              <div key={tag._id} onClick={() => removeTag(tag)}>
                {tag.title}
              </div>
            ))}
          </div>
        </div>
        <button
          className={styles.deleteButton}
          onClick={() => deleteMediaFile(file._id, file.title)}
        >
          &#10005;
        </button>
        <button
          className={styles.applyButton}
          onClick={() => submitFileChanges(file._id)}
        >
          &#10003;
        </button>
      </div>
    </div>
  )
}

export default EditFile
