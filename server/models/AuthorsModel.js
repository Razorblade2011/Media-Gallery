import mongoose from 'mongoose'

// модель автора
const authorSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true, require: true },
    description: { type: String, default: 'none' },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
  },
  { timestamps: true }
)

const AuthorModel =
  mongoose.models.Author || mongoose.model('Author', authorSchema)

export { AuthorModel }
