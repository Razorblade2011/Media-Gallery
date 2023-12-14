import mongoose from 'mongoose'

// модель пользователя
const userSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    avatar: String,
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
    settings: {
      videoVolume: { type: Number, default: 1 },
      objectPerPage: { type: Number, default: 30 },
    },
  },
  { timestamps: true }
)

const UserModel = mongoose.models.Post || mongoose.model('User', userSchema)

export { UserModel }
