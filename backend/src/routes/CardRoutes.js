const routes = require('express').Router()
const CardController = require('../controllers/CardController')

// middlewares
const verifyToken = require('../middlewares/verify-token')

routes.get('/', CardController.lists)
routes.get('/:id', CardController.listById)
routes.get('/user/:id', CardController.listByUserId)
routes.post('/', verifyToken, CardController.createCard)
routes.delete('/:id', verifyToken, CardController.deleteCard)

module.exports = routes