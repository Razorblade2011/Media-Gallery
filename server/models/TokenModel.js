import mongoose from 'mongoose'

const tokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, unique: true, require: true },
  refreshToken: { type: String, require: true },
})

export default mongoose.models.Token || mongoose.model('Token', tokenSchema)
