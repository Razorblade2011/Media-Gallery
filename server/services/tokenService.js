import jwt from 'jsonwebtoken'
import { TokenModel } from '../models/TokenModel.js'

class TokenService {
  // возвращает пару токенов
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '2h',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    })
    return { accessToken, refreshToken }
  }

  // сохраняет refreshToken в бд
  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({ user: userId, refreshToken })
    return token
  }

  // проверяет accessToken токен на валидность
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  // проверяет refreshToken токен на валидность
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  // удаляет refreshToken
  async removeToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({ refreshToken })
    return tokenData
  }

  // возвращает refreshToken
  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken })
    return tokenData
  }
}

export default new TokenService()
