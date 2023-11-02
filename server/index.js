import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import userRouter from './routes/user.route.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import mediaRouter from './routes/media.route.js'
import fileUpload from 'express-fileupload'

config()

const PORT = process.env.PORT || 5000
const ROOT_DIR = process.cwd()

const app = express()

app.use(express.static(ROOT_DIR + '/upload')) // выдаче статики сервером (для файлов)

app.use(fileUpload({})) // middleware загрузки файлов

// cors с настройками общения с клиентом
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)
app.use(express.json()) // json парсер запросов и ответов
app.use(cookieParser()) // для работы с cookie
app.use('/api/users', userRouter) // роутер пользователей
app.use('/api/media', mediaRouter) // роутер файлов
app.use(errorMiddleware) // middleware обработки ошибок

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
