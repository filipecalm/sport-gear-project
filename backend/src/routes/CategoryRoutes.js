const routes = require('express').Router()
const CategoryController = require('../controllers/CategoryController')

// middlewares
const verifyToken = require('../middlewares/verify-token')
const verifyAdmin = require('../middlewares/verify-admin')

routes.post('/', verifyToken, verifyAdmin, CategoryController.createCategory)
routes.get('/', CategoryController.listCategories)
routes.get('/:id', verifyToken, verifyAdmin, CategoryController.getOne)
routes.patch('/:id', verifyToken, verifyAdmin, CategoryController.updateCategory)
routes.delete('/:id', verifyToken, verifyAdmin, CategoryController.deleteCategory)

module.exports = routes