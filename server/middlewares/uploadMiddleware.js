import multer, { diskStorage } from 'multer'
import path from 'path'

// middleware для загрузки файлов в хранилище
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload')
  },
  filename: (req, file, cb) => {
    console.log('muler files', file)
    cb(
      null,
      path.basename(file.originalname) +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    )
  },
})

const upload = multer({ storage })

export default upload
