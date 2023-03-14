const routes = require('express').Router()
const UserController = require('../controllers/UserController')

// middlewares
const verifyToken = require('../middlewares/verify-token')
const verifyAdmin = require('../middlewares/verify-admin')
const AuthUserValidation = require('../validations/User/create')

const AuthLoginValidation = require('../validations/auth/login')

routes.get('/', verifyToken, verifyAdmin, UserController.getAll)
routes.get('/:id', verifyToken, verifyAdmin, UserController.getOne)
routes.post('/', AuthUserValidation, UserController.register)
routes.patch(
  '/:id',
  verifyToken,
  UserController.updatedUser
)
routes.post(
  '/registerAdmin',
  verifyToken,
  verifyAdmin,
  AuthUserValidation,
  UserController.registerAdmin
)
routes.delete(
  '/:id',
  verifyToken,
  UserController.deleteUser
)
routes.get('/check', UserController.checkUser)
routes.post('/login', AuthLoginValidation, UserController.login)

module.exports = routes