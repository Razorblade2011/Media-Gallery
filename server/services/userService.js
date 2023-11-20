import { UserModel } from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import tokenService from './tokenService.js'
import { UserDto } from '../dtos/userDto.js'
import ApiError from '../exceptions/apiError.js'

class UserService {
  // регистрирует нового пользователя
  async register(userName, email, password) {
    const candidateUser = await UserModel.findOne({ name: userName })
    if (candidateUser) {
      throw ApiError.BadRequest(
        `Пользователь с таким именем ${userName} уже существует!`
      )
    }
    const candidateEmail = await UserModel.findOne({ email })
    if (candidateEmail) {
      throw ApiError.BadRequest(
        `Пользователь с таким адресом ${email} уже существует!`
      )
    }
    const hashedPassword = await bcrypt.hash(password, 6)

    const user = await UserModel.create({
      name: userName,
      email,
      password: hashedPassword,
    })

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto,
    }
  }

  // вход пользователя в систему
  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден')
    }
    const passCheck = await bcrypt.compare(password, user.password)
    if (!passCheck) {
      throw ApiError.BadRequest('Неправильный пароль')
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto,
    }
  }

  // выход пользователя из системы
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError()
    }

    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnathorizedError()
    }

    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto,
    }
  }

  // возвращает информацию о пользователе из бд
  async getUser(id) {
    return await UserModel.findById(id)
  }

  // добавляет информацию о файле пользователю
  async addMediaToUser(userId, mediaId) {
    return UserModel.findByIdAndUpdate(userId, {
      $addToSet: { files: mediaId },
    })
  }

  // добавляет информацию о файлах пользователю
  async addMediaFilesToUser(userId, mediaIds) {
    return UserModel.findByIdAndUpdate(userId, {
      $addToSet: { files: { $in: mediaIds } },
    })
  }
  // удаляет информацию о файле у пользователя
  async removeMediaFromUser(userId, mediaId) {
    return UserModel.updateOne({ _id: userId }, { $pull: { files: mediaId } })
  }
  // удаляет информацию о файлах у пользователя
  async removeMediaFilesFromUser(userId, mediaIds) {
    return UserModel.findByIdAndUpdate(userId, {
      $pull: { files: { $in: mediaIds } },
    })
  }
}

export default new UserService()
