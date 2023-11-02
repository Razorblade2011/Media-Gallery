import { AuthorModel } from '../models/AuthorsModel.js'

class AuthorsService {
  // возвращает всех авторов из бд
  async getAuthors() {
    const res = await AuthorModel.find()
    return res
  }

  // создаёт нового автора
  async createAuthor(title, description) {
    const res = await AuthorModel.create({ title, description })
    return res
  }

  // изменяет данные автора
  async editAuthor(_id, title, description) {
    const res = await AuthorModel.updateOne({ _id }, { title, description })
    return res
  }

  // удаляет запись об авторе из бд
  async deleteAuthor(id) {
    const res = await AuthorModel.deleteOne({ $where: { _id: id } })
    return res
  }

  // регистрирует файл у автора
  async addMediaToAuthor(authorId, mediaId) {
    return await AuthorModel.findByIdAndUpdate(
      authorId,
      {
        $addToSet: { files: mediaId },
      },
      { new: true, useFindAndModify: false }
    )
  }
  // регистрирует файлы у автора
  async addMediaFilesToAuthor(authorId, mediaIds) {
    return await AuthorModel.findByIdAndUpdate(
      authorId,
      {
        $addToSet: { files: { $in: mediaIds } },
      },
      { new: true, useFindAndModify: false }
    )
  }
  // удаляет запись о пренадлежности файла к автору
  async removeMediaFromAuthor(authorId, mediaId) {
    return await AuthorModel.updateOne(
      { _id: authorId },
      {
        $pull: { files: mediaId },
      }
    )
  }

  // удаляет запись о пренадлежности файлов к автору
  async removeMediaFilesFromAuthor(authorId, mediaIds) {
    return await AuthorModel.findByIdAndUpdate(authorId, {
      $pull: { files: { $in: mediaIds } },
    })
  }
}

export default new AuthorsService()
