import { Router } from 'express'
import userConroller from '../controllers/user.conroller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
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
userRouter.post('/updatePassword', authMiddleware, userConroller.updatePassword)
userRouter.post('/updateAvatar', authMiddleware, userConroller.updateAvatar)
userRouter.get('/checkName', authMiddleware, userConroller.checkName)
userRouter.post('/changeName', authMiddleware, userConroller.changeName)
userRouter.post('/logout', authMiddleware, userConroller.logout)
userRouter.post('/volume', authMiddleware, userConroller.setVolume)

export default userRouter
