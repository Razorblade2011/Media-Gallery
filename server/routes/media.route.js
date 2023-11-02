import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import mediaController from '../controllers/media.controller.js'
import tagsController from '../controllers/tags.controller.js'
import authorsController from '../controllers/authors.controller.js'

const mediaRouter = new Router()

mediaRouter.get('/', mediaController.getMedia)
mediaRouter.post('/', authMiddleware, mediaController.createMedia)
mediaRouter.put('/', authMiddleware, mediaController.editMedia)
mediaRouter.delete('/:id', authMiddleware, mediaController.deleteMedia)
mediaRouter.get('/tags', tagsController.getTags)
mediaRouter.post('/tags', authMiddleware, tagsController.createTags)
mediaRouter.delete('/tags/:id', authMiddleware, tagsController.deleteTags)
mediaRouter.get('/authors', authorsController.getAuthors)
mediaRouter.post('/authors', authMiddleware, authorsController.createAuthor)
mediaRouter.put('/authors', authMiddleware, authorsController.editAuthor)

export default mediaRouter
