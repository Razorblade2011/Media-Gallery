import { ReactNode, useRef, FC } from 'react'
import styles from './ModalWindow.module.scss'
import { useAppDispatch } from '../../redux/reduxHooks'
import { setModalShow } from '../../redux/features/gallerySlice'

interface Props {
  children: ReactNode
}
const ModalWindow: FC<Props> = ({ children }) => {
  const window = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  function onClose() {
    dispatch(setModalShow(false))
  }

  return (
    <div
      ref={window}
      onClick={(e) => (e.target === window.current ? onClose() : null)}
      className={styles.modalwindow}
    >
      {children}
    </div>
  )
}

export default ModalWindow
