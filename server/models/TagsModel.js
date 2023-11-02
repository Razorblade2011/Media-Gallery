import mongoose from 'mongoose'

// модель тега
const tagSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true, require: true },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
  },
  { timestamps: true }
)

const TagsModel = mongoose.models.Tag || mongoose.model('Tag', tagSchema)

export { TagsModel }
