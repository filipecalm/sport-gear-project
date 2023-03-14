const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  newpassword: {
    type: String,
    trim: true
  },
  confirmpassword: {
    type: String,
    trim: true
  },
  role: {
    type: String,
  },
  cpf: {
    type: String,
    trim: true
  },
  rg: {
    type: String,
    trim: true
  },
  birth: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  gender:{
    type: String,
    trim: true
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
