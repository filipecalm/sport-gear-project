require('dotenv/config')
const jwt = require('jsonwebtoken')

const decodedToken = token => {
  return jwt.verify(token, process.env.JWT_TOKEN_SECRET)
}

module.exports = decodedToken
