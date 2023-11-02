import mongoose from 'mongoose'

// модель файла
const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    size: { type: Number },
    type: { type: String },
    width: { type: Number },
    height: { type: Number },
    extention: { type: String },
    originalPath: { type: String },
    previewPath: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    fragmentPreviewPath: { type: String },
    duration: { type: String },
    user: { type: mongoose.Schema.ObjectId, require: true },
  },
  { timestamps: true }
)

const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaSchema)

export { MediaModel }
