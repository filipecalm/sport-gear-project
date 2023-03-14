const routes = require('express').Router()
const ProductController = require('../controllers/ProductController')

// middlewares
const verifyToken = require('../middlewares/verify-token')
const verifyAdmin = require('../middlewares/verify-admin')
const { imageUpload } = require('../helpers/image-upload')
const AuthProductValidation = require('../validations/Product/create')


routes.get('/category/:categoryId', ProductController.listProductsByCategory);

routes.post(
  '/',
  verifyToken,
  verifyAdmin,
  imageUpload.single('images'),
  AuthProductValidation,
  ProductController.createProduct
)
routes.get('/', ProductController.listProducts)
routes.get('/:id', ProductController.listProduct)
routes.patch(
  '/:id',
  imageUpload.single('images'),
  ProductController.updateProduct
)
routes.delete('/:id', ProductController.deleteProduct)

module.exports = routes
