require('dotenv/config')
const jwt = require('jsonwebtoken')
const MESSAGE = require('../constants/messages')

const createUserToken = async (user, res) => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    secret = process.env.JWT_TOKEN_SECRET,
  )

  res.status(200).json({
    message: MESSAGE.SUCCESS.USER.LOGGED,
    token: token,
    userId: user.id,
    Email: user.email,
    role: user.role
  })
}

module.exports = createUserToken
