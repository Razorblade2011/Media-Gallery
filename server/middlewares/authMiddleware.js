import ApiError from '../exceptions/apiError.js'
import tokenService from '../services/tokenService.js'

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnathorizedError())
    }
    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnathorizedError())
    }
    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnathorizedError())
    }
    req.user = userData
    next()
  } catch (error) {
    return next(ApiError.UnathorizedError())
  }
}

export default authMiddleware
