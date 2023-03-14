require('dotenv/config')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(
  cors({ origin: `http://${process.env.HOST}:${process.env.CLIENT_PORT}` })
)

const bodyParser = require('body-parser')

// Aumenta o limite de upload para 50mb (ou qualquer outro valor)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
const conn = require('./src/database/db')
const handleError = require('./src/helpers/handleError')

// Config JSON
app.use(express.json())

app.use(
  express.urlencoded({
    extended: true
  })
)

// Public Images
app.use(express.static('public'))

// routes
const ProductRoutes = require('./src/routes/ProductRoutes')
const UserRoutes = require('./src/routes/UserRoutes')
const CategoryRoutes = require('./src/routes/CategoryRoutes')
const CardRoutes = require('./src/routes/CardRoutes')

app.use('/product', ProductRoutes)
app.use('/user', UserRoutes)
app.use('/category', CategoryRoutes)
app.use('/card', CardRoutes)

app.use(handleError)

app.listen(process.env.SERVER_PORT)