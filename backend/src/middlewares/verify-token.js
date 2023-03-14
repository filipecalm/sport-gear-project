const getToken = require('../helpers/get-token')
const decodedToken = require('../helpers/token-decoded')
const MESSAGE = require('../constants/messages')

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
  }

  const token = getToken(req)

  if (!token) {
    return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
  }

  try {
    const verify = decodedToken(token)
    req.user = verify

    next()
  } catch (err) {
    return res.status(400).json(MESSAGE.ERROR.ACCESS_DENIED)
  }
}

module.exports = checkToken
