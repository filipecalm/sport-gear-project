const { User } = require('../models/index')
const bcrypt = require('bcrypt')
const MESSAGE = require('../constants/messages')

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const decodedToken = require('../helpers/token-decoded')

module.exports = class UserController {
  static async getAll(req, res) {
    try {
      if (req.headers.authorization) {
        const users = await User.find({}, { password: 0, confirmpassword: 0 })
        res.status(200).json(users)
      } else {
        res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
      }
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params
      const user = await User.findById(id, { password: 0, confirmpassword: 0 })

      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)

      res.status(200).json(user)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }


  static async register(req, res) {
    try {
      const { name, email, password, confirmpassword, cpf, rg, birth, phone, gender } = req.body

      if (password !== confirmpassword)
        throw new Error(MESSAGE.ERROR.USER.PASS_ERROR)

      // verificar se o email existe no db
      const userExists = await User.findOne({ email })

      if (userExists) throw new Error(MESSAGE.ERROR.USER.EMAIL_ERROR)

      const salt = await bcrypt.genSalt(12)
      const passwordBcrypt = await bcrypt.hash(password, salt)

      let roleClient = 'client'

      // Se não houver admin no db, o primeiro usuário torna-se um admin
      const adminExists = await User.count({ role: 'admin' })
      if (!adminExists) {
        roleClient = 'admin'
      }

      const user = new User({
        name,
        email,
        password: passwordBcrypt,
        confirmpassword: passwordBcrypt,
        role: roleClient,
        cpf,
        rg,
        birth,
        phone,
        gender
      })

      const newUser = await user.save()

      await createUserToken(newUser, res)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async updatedUser(req, res) {
    try {
      const { id } = req.params

      const { name, email, password, newpassword, confirmpassword, cpf, rg, birth, phone, gender } = req.body

      if (newpassword && confirmpassword && newpassword !== confirmpassword) {
        return res.status(400).json(MESSAGE.ERROR.USER.PASS_ERROR)
      }

      const user = await User.findById(id)
      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)

      if (password) {
        // Verifica se a senha antiga está correta
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
      }

      if (email && email !== user.email) {
        // Se o novo email é diferente do email atual, verifica se o email já existe no banco de dados
        const emailExists = await User.findOne({ email })
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
          return res.status(400).json(MESSAGE.ERROR.USER.EMAIL_ERROR)
        }
      }

      let passwordBcrypt
      if (newpassword) {
        const salt = await bcrypt.genSalt(12)
        passwordBcrypt = await bcrypt.hash(newpassword, salt)
      }

      await User.findByIdAndUpdate(id, {
        name: name ? name : user.name,
        email: email ? email : user.email,
        password: passwordBcrypt ? passwordBcrypt : user.password,
        cpf: cpf ? cpf : user.cpf,
        rg: rg ? rg : user.rg,
        birth: birth ? birth : user.birth,
        phone: phone ? phone : user.phone,
        gender: gender ? gender : user.gender
      })

      res.json(MESSAGE.SUCCESS.USER.UPDATED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async registerAdmin(req, res) {
    try {
      const { name, email, password, confirmpassword } = req.body

      if (password !== confirmpassword)
        throw new Error(MESSAGE.ERROR.USER.PASS_ERROR)

      // verificar se o email existe no db
      const userExists = await User.findOne({ email })

      if (userExists) throw new Error(MESSAGE.ERROR.USER.EMAIL_ERROR)

      const salt = await bcrypt.genSalt(12)
      const passwordBcrypt = await bcrypt.hash(password, salt)

      const roleADM = 'admin'

      const user = new User({
        name,
        email,
        password: passwordBcrypt,
        confirmpassword: passwordBcrypt,
        role: roleADM
      })

      const newUser = await user.save()

      await createUserToken(newUser, res)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body

      // verificar se o email existe no db
      const user = await User.findOne({ email })
      if (!user) throw new Error(MESSAGE.ERROR.USER.PASS_EMAIL)

      const checkPassword = await bcrypt.compare(password, user.password)
      if (!checkPassword) throw new Error(MESSAGE.ERROR.USER.PASS_ERROR)

      await createUserToken(user, res)
    } catch (error) {
      res.status(401).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async checkUser(req, res) {
    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = decodedToken(token)

      const currentUser = await User.findById(decoded.id).select('-password -confirmpassword')
      res.status(200).send(currentUser)
    } else {
      res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params

      const user = await User.findById(id)
      if (!user) return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)

      await User.findByIdAndRemove(id)

      res.json(MESSAGE.SUCCESS.USER.DELETED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async deleteCurrentUser(req, res) {
    // caso o usuário queira excluir a própria conta
    try {
      const { id } = req.params
      const token = getToken(req)

      const decoded = decodedToken(token)

      // verifica se o id da requisição corresponde ao id do token
      if (decoded.id !== id) {
        return res.status(401).json(MESSAGE.ERROR.ACCESS_DENIED)
      }

      const user = await User.findByIdAndDelete(id)

      if (!user) {
        return res.status(404).json(MESSAGE.ERROR.USER.NOT_FOUND)
      }

      res.json({ message: MESSAGE.SUCCESS.USER.DELETED })
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }
}