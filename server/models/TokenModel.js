import mongoose from 'mongoose'

// модель токена
const tokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, unique: true, require: true },
  refreshToken: { type: String, require: true },
})

const TokenModel = mongoose.models.Token || mongoose.model('Token', tokenSchema)

export { TokenModel }
