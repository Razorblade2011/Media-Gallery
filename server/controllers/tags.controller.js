import tagsService from '../services/tagsService.js'

class MediaController {
  // возвращает информацию о всех тегах из бд
  async getTags(req, res, next) {
    try {
      const tags = await tagsService.getTags()
      return res.json(tags)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  // создаёт теги
  async createTags(req, res, next) {
    try {
      const { body } = req
      const tags = await tagsService.createTags(body)
      return res.json(tags)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  // удаляет теги
  async deleteTags(req, res, next) {
    try {
      const { params } = req
      const tag = await tagsService.deleteTag(params.id)
      return res.json(tag)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export default new MediaController()
