import ApiError from '../exceptions/apiError.js'
import userService from '../services/userService.js'
import { validationResult } from 'express-validator'

class UserController {
  // регистрирует нового пользователя
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const { files, body } = req
      const userData = await userService.register(
        body.userName,
        files.avatar,
        body.email,
        body.password
      )
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      const { refreshToken: token, ...returnData } = userData
      return res.json(returnData)
    } catch (error) {
      next(error)
    }
  }

  // вход пользователя в систему
  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      const { refreshToken: token, ...returnData } = userData
      return res.json(returnData)
    } catch (error) {
      next(error)
    }
  }

  // обновление пароля
  async updatePassword(req, res, next) {
    try {
      const { email, oldPassword, newPassword } = req.body
      const userData = await userService.updatePassword(
        email,
        oldPassword,
        newPassword
      )
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      userData.message = 'Пароль обновлён'
      const { refreshToken: token, ...returnData } = userData
      return res.json(returnData)
    } catch (error) {
      next(error)
    }
  }

  // выход пользователя из системы
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.status(200).json({ message: 'Пользователь вышел' })
    } catch (error) {
      next(error)
    }
  }

  // обновления токена
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      const { refreshToken: token, ...returnData } = userData
      return res.json(returnData)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
