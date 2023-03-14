const multer = require('multer')
const path = require('path')
const MESSAGE = require('../constants/messages')

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = ''

    if (req.baseUrl.includes('product')) {
      folder = 'product'
    }

    cb(null, `public/images/${folder}`)
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        String(Math.floor(Math.random() * 1000)) +
        path.extname(file.originalname)
    )
  }
})

const imageUpload = multer({
  storage: Storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error(MESSAGE.ERROR.UPLOAD_ERROR))
    }
    cb(undefined, true)
  }
})

module.exports = { imageUpload }