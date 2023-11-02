import { parse, extname } from 'path'
import { MediaModel } from '../models/MediaModel.js'
import {
  getVideoDimentions,
  createFragmentPreview,
  createVideoScreenshot,
  getVideoScreenshotSize,
} from '../utils/ffmpeg.js'
import { createPreviewImage, getImageInfo } from '../utils/images.js'
import { existsSync, unlinkSync } from 'fs'
import tagsService from './tagsService.js'
import userService from './userService.js'
import authorsService from './authorsService.js'

class MediaService {
  // возвращает информацию о всех файлах из бд
  async getMediaFiles(
    page = 1,
    limit = 30,
    sort = 'createdAt',
    way = 1,
    search = ''
  ) {
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = parseInt(page) * parseInt(limit)

    const results = {}

    if (search) {
      const count = await MediaModel.find({
        tags: { $all: search.split(',') },
      })
        .countDocuments()
        .exec()

      results.pageCount = Math.ceil(count / parseInt(limit))
      if (endIndex < count) {
        results.next = {
          page: parseInt(page) + 1,
          limit: parseInt(limit),
        }
      }

      if (startIndex > 0) {
        results.previous = {
          page: parseInt(page) - 1,
          limit: parseInt(limit),
        }
      }
      results.results = await MediaModel.find({
        tags: { $all: search.split(',') },
      })
        .populate('author')
        .populate('tags')
        .sort([[sort, 1]])
        .limit(limit)
        .skip(startIndex)
        .exec()

      return results
    } else {
      const count = await MediaModel.countDocuments().exec()

      results.pageCount = Math.ceil(count / parseInt(limit))
      if (endIndex < count) {
        results.next = {
          page: parseInt(page) + 1,
          limit: parseInt(limit),
        }
      }

      if (startIndex > 0) {
        results.previous = {
          page: parseInt(page) - 1,
          limit: parseInt(limit),
        }
      }
      results.results = await MediaModel.find()
        .populate('author')
        .populate('tags')
        .sort([[sort, way]])
        .limit(limit)
        .skip(startIndex)
        .exec()
      return results
    }
  }

  // возвращает информацию о файле из бд
  async getMediaFile(id) {
    return await MediaModel.findById(id)
  }

  // создаёт файл
  async createMediaFile(
    file,
    type,
    userId,
    author = 'test',
    tags = [1, 2, 3, 4]
  ) {
    const DIR_NAME = process.cwd()
    const name = `${parse(file.name).name}-${Date.now()}${extname(file.name)}`
    if (type === 'video') {
      const originalFilePath = `${DIR_NAME}/upload/original/${name}`
      const fragmentPreviewPath = `${DIR_NAME}/upload/preview/previewFragment_${name}`
      const previewPath = `${DIR_NAME}/upload/preview/`

      if (existsSync(originalFilePath)) {
        throw new Error(`Файл с именем уже существует!`)
      }

      await file.mv(originalFilePath)

      const { width, height, duration } = await getVideoDimentions(
        originalFilePath
      )
      const { previewWidth, previewHeight } = await getVideoScreenshotSize(
        width,
        height
      )
      await createVideoScreenshot(
        originalFilePath,
        name,
        previewPath,
        previewWidth,
        previewHeight
      )

      await createFragmentPreview(originalFilePath, fragmentPreviewPath)

      const res = await MediaModel.create({
        title: parse(file.name).name,
        size: file.size,
        type: 'video',
        width,
        height,
        extention: extname(file.name).split('.')[1],
        originalPath: `/original/${name}`,
        previewPath: `/preview/preview_${name}.png`,
        author,
        tags,
        fragmentPreviewPath: `/preview/previewFragment_${name}`,
        duration,
        user: userId,
      })
      await tagsService.addMediaToTags(tags, res._id)
      await authorsService.addMediaToAuthor(author, res._id)
      await userService.addMediaToUser(userId, res._id)
    }
    if (type === 'image') {
      const previewFilePath = `${DIR_NAME}/upload/preview/preview_${name}`
      const originalFilePath = `${DIR_NAME}/upload/original/${name}`

      if (existsSync(originalFilePath)) {
        throw new Error(`Файл с именем уже существует!`)
      }

      await file.mv(originalFilePath)

      await createPreviewImage(originalFilePath, previewFilePath)
      const { width, height } = getImageInfo(originalFilePath)

      const res = await MediaModel.create({
        title: parse(file.name).name,
        size: file.size,
        type: 'image',
        width,
        height,
        extention: extname(file.name).split('.')[1],
        originalPath: `/original/${name}`,
        previewPath: `/preview/preview_${name}`,
        author,
        tags,
        user: userId,
      })
      await tagsService.addMediaToTags(tags, res._id)
      await authorsService.addMediaToAuthor(author, res._id)
      await userService.addMediaToUser(userId, res._id)
    }
  }

  // добавляет информацию об авторе файлу
  async addAuthorToMedia(mediaId, authorId) {
    return await MediaModel.updateOne(
      { _id: mediaId },
      { $set: { author: authorId } }
    )
  }

  // удаляет запись о пренадлежности автора к файлам
  async removeAuthorFromMediaFiles(mediaIds, authorId) {
    return await MediaModel.updateMany(
      { _id: { $in: mediaIds } },
      { $pull: { author: authorId } }
    )
  }

  // добавляет тег файлу
  async addTagToMedia(mediaId, tagId) {
    return await MediaModel.findByIdAndUpdate(
      mediaId,
      { $addToSet: { tags: tagId } },
      { new: true, useFindAndModify: false }
    )
  }

  // добавляет теги файлу
  async addTagsToMedia(mediaId, tagsIds) {
    return await MediaModel.updateOne(
      { _id: mediaId },
      {
        $addToSet: { tags: { $each: tagsIds } },
      },
      { new: true, useFindAndModify: false }
    )
  }

  // меняет название файла
  async changeMediaTitle(mediaId, mediaTitle) {
    return await MediaModel.updateOne(
      { _id: mediaId },
      { $set: { title: mediaTitle } }
    )
  }

  // удаляет тег у файла
  async removeTagFromMedia(mediaId, tagsId) {
    return await MediaModel.findByIdAndUpdate(mediaId, {
      $pull: { tags: tagsId },
    })
  }

  // удаляет тег у файлов
  async removeTagFromMediaFiles(mediaIds, tagsId) {
    return await MediaModel.updateMany(
      { _id: { $in: mediaIds } },
      {
        $pull: { tags: tagsId },
      }
    )
  }

  // удаляет теги у файла
  async removeTagsFromMedia(mediaId, tagsIds) {
    return await MediaModel.findByIdAndUpdate(mediaId, {
      $pull: { tags: { $in: tagsIds } },
    })
  }

  // удаляет файл
  async deleteMediaFile(id) {
    const res = await MediaModel.findByIdAndDelete(id)
    await tagsService.removeMediaFromTags(res.tags, res._id)
    await userService.removeMediaFromUser(res.user, res._id)
    await authorsService.removeMediaFromAuthor(res.author, res._id)
    const ROOT = `${process.cwd()}/upload`
    unlinkSync(ROOT + res.originalPath)
    unlinkSync(ROOT + res.previewPath)
    if (res.fragmentPreviewPath) {
      unlinkSync(ROOT + res.fragmentPreviewPath)
    }
    return res
  }
}

export default new MediaService()
