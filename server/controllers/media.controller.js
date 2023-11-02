import authorsService from '../services/authorsService.js'
import mediaService from '../services/mediaService.js'
import tagsService from '../services/tagsService.js'

class MediaController {
  // возвращает информацию о всех файлах из бд
  async getMedia(req, res, next) {
    try {
      const { query } = req
      const { page, limit, sort, way, search } = query
      const files = await mediaService.getMediaFiles(
        page,
        limit,
        sort,
        way,
        search
      )
      return res.json(files)
    } catch (error) {
      next(error)
    }
  }

  // создаёт файл
  async createMedia(req, res, next) {
    try {
      const { files, body } = req
      const userId = body.user
      const author = JSON.parse(body.author)
      const tags = JSON.parse(body.tags)
      const names = []
      for (const key in files) {
        if (key === 'video') {
          if (Array.isArray(files[key])) {
            files[key].map((file) => {
              mediaService.createMediaFile(file, 'video', userId, author, tags)
              names.push(file.name)
            })
          } else {
            mediaService.createMediaFile(
              files[key],
              'video',
              userId,
              author,
              tags
            )
            names.push(files[key].name)
          }
        }
        if (key === 'image') {
          if (Array.isArray(files[key])) {
            files[key].map((file) => {
              mediaService.createMediaFile(file, 'image', userId, author, tags)
              names.push(file.name)
            })
          } else {
            mediaService.createMediaFile(
              files[key],
              'image',
              userId,
              author,
              tags
            )
            names.push(files[key].name)
          }
        } else if (key === 'cover') {
          continue
        } else if (key === 'user') {
          continue
        } else if (key === 'tags') {
          continue
        } else if (key === 'author') {
          continue
        }
      }
      if (names.length > 1) {
        const result = names.reduce((total, name) => total + ', ' + name)
        return res.json(`Файлы ${result} загружены!`)
      } else {
        console.log(names)
        return res.json(`Файл ${names[0]} загружен!`)
      }
    } catch (error) {
      next(error)
    }
  }

  // редактирует файл
  async editMedia(req, res, next) {
    try {
      const { body } = req
      const { mediaId, mediaAuthor, tagsIds, mediaTitle } = body
      const tagsIdsParsed = JSON.parse(tagsIds)
      const currentFile = await mediaService.getMediaFile(mediaId)
      let updatedCurrentFile = null
      if (mediaTitle) {
        //  change name
        updatedCurrentFile = await mediaService.changeMediaTitle(
          mediaId,
          mediaTitle
        )
      }
      // work with tags
      await mediaService.removeTagsFromMedia(mediaId, currentFile.tags)
      await tagsService.removeMediaFromTags(currentFile.tags, mediaId)
      await mediaService.addTagsToMedia(mediaId, tagsIdsParsed)
      await tagsService.addMediaToTags(tagsIdsParsed, mediaId)
      // work with author
      if (currentFile.author !== mediaAuthor) {
        await authorsService.removeMediaFromAuthor(mediaAuthor, mediaId)
        await mediaService.addAuthorToMedia(mediaId, mediaAuthor)
        await authorsService.addMediaToAuthor(mediaAuthor, mediaId)
      }
      if (updatedCurrentFile) {
        return res.json(`Файл ${updatedCurrentFile.title} обновлён.`)
      }
      return res.json(`Файл ${currentFile.title} обновлён.`)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  // удаляет файл
  async deleteMedia(req, res, next) {
    try {
      const { params } = req
      const media = mediaService.deleteMediaFile(params.id)
      return res.json(media)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

export default new MediaController()
