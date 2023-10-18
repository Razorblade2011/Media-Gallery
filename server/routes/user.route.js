import { Router } from 'express'
import userConroller from '../controllers/user.conroller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { body } from 'express-validator'

const router = new Router()

router.get('/', authMiddleware, userConroller.getUsers)
router.get('/refresh', userConroller.refresh)
router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  userConroller.registration
)
router.post('/login', userConroller.login)
router.post('/logout', userConroller.logout)

export default router
