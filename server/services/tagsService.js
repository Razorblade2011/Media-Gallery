import { TagsModel } from '../models/TagsModel.js'
import mediaService from './mediaService.js'

class TagsService {
  // возвращает информацию о всех тегах из бд
  async getTags() {
    const tags = await TagsModel.find().sort({ title: 1 })
    return tags
  }

  // создаёт теги
  async createTags(tags) {
    const tagsForUpload = tags.map((tagName) => {
      return {
        title: tagName,
      }
    })
    const res = await TagsModel.insertMany(tagsForUpload)
    return res
  }

  // присваивает файл тегу
  async addMediaToTag(tagId, mediaId) {
    return await TagsModel.findByIdAndUpdate(
      tagId,
      { $addToSet: { files: mediaId } },
      { new: true, useFindAndModify: false }
    )
  }

  // присваивает файлы тегу
  async addMediaFilesToTag(tagId, mediaIds) {
    return await TagsModel.findByIdAndUpdate(
      tagId,
      { $addToSet: { files: { $each: mediaIds } } },
      { new: true, useFindAndModify: false }
    )
  }

  // прсиваивает файл тегам
  async addMediaToTags(tagsIds, mediaId) {
    return await TagsModel.updateMany(
      { _id: { $in: tagsIds } },
      { $addToSet: { files: mediaId } },
      { new: true, useFindAndModify: false }
    )
  }

  // удаляет информацию о файлах из записи тега
  async removeMediaFilesFromTag(tagId, mediaIds) {
    return await TagsModel.findByIdAndUpdate(tagId, {
      $pull: { files: { each: mediaIds } },
    })
  }

  // удаляет информацию о файле из записей тегов
  async removeMediaFromTags(tagsIds, mediaId) {
    return await TagsModel.updateMany(
      { _id: { $in: tagsIds } },
      {
        $pull: { files: mediaId },
      }
    )
  }

  // удаляет тег
  async deleteTag(id) {
    const res = await TagsModel.findByIdAndDelete(id)
    await mediaService.removeTagFromMediaFiles(res.files, res._id)
    return res
  }
}

export default new TagsService()
