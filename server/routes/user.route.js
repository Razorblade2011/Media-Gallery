import { Router } from 'express'
import userConroller from '../controllers/user.conroller.js'
import { body } from 'express-validator'

const userRouter = new Router()

userRouter.get('/refresh', userConroller.refresh)
userRouter.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  userConroller.registration
)
userRouter.post('/login', userConroller.login)
userRouter.post('/updatePassword', userConroller.updatePassword)
userRouter.post('/updateAvatar', userConroller.updateAvatar)
userRouter.post('/logout', userConroller.logout)
userRouter.post('/volume', userConroller.setVolume)

export default userRouter
