import authorsService from '../services/authorsService.js'

class AuthorsController {
  // возвращает информацию о всех авторах из бд
  async getAuthors(req, res, next) {
    try {
      const authors = await authorsService.getAuthors()
      return res.json(authors)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  // создаёт автора
  async createAuthor(req, res, next) {
    try {
      const { body } = req
      const newAuthor = await authorsService.createAuthor(
        body.title,
        body.description
      )
      return res.json(newAuthor)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  // вносит изменения в автора
  async editAuthor(req, res, next) {
    try {
      const { body } = req
      const { _id, title, description } = body
      const updatedAuthor = await authorsService.editAuthor(
        _id,
        title,
        description
      )
      return res.json(updatedAuthor)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export default new AuthorsController()
