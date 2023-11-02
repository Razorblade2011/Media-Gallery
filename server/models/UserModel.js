import mongoose from 'mongoose'

// модель пользователя
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
  },
  { timestamps: true }
)

const UserModel = mongoose.models.Post || mongoose.model('User', userSchema)

export { UserModel }
