import getToken from '../helpers/get-token'
import decodedToken from '../helpers/token-decoded'
import { User } from '../models'

const verifyAdmin = async (req, res, next) => {
  try {
    const token = getToken(req)
    const { id } = decodedToken(token)
    const user = await User.findById(id)

    if (user.role != 'admin') throw new Error(`Operação não permitida!`)
    next()
  } catch (error) {
    return res.status(403).json({ message: error.message })
  }
}

export default verifyAdmin
