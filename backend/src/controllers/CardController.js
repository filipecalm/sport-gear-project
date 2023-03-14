const { Product, Orders, OrdersProduct } = require('../models')
const getToken = require('../helpers/get-token')
const decodedToken = require('../helpers/token-decoded')
const MESSAGE = require('../constants/messages')

module.exports = class CardController {
  static async lists(req, res) {
    try {
      const sales = await Orders.find().populate({
        path: 'OrdersProductId',
        populate: {
          path: 'productsId',
          model: 'Product'
        }
      })

      res.status(200).json(sales)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listById(req, res) {
    try {
      const { id } = req.params

      const sale = await Orders.findById(id).populate({
        path: 'OrdersProductId',
        populate: {
          path: 'productsId',
          model: 'Product'
        }
      })
      res.status(200).json(sale)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listByUserId(req, res) {
    try {
      const { id } = req.params

      const orders = await Orders.find({ userId: id }).populate({
        path: 'OrdersProductId',
        populate: { path: 'productsId', model: 'Product' }
      })

      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async createCard(req, res) {
    try {
      const { userId } = req.body

      let itens = []
      let pricetotal = 0

      const token = getToken(req)
      const decoded = decodedToken(token)

      await Promise.all(
        req.body.product.map(async product => {
          const findProduct = await Product.findById(product.productsId)

          pricetotal += findProduct.price * product.amount

          const newItem = new OrdersProduct({
            productsId: product.productsId,
            amount: product.amount,
            price: product.price
          })

          const item = await newItem.save()

          itens.push(item)
        })
      )

      const newsale = new Orders({
        userId: userId ? userId : decoded.id,
        priceTotal: pricetotal,
        OrdersProductId: itens
      })

      const sale = await newsale.save()

      res.status(201).json(sale)
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async deleteCard(req, res) {
    try {
      const { id } = req.params

      const orders = await Orders.findById(id)

      Promise.all(
          orders.OrdersProductId.map(async ordersProductId => {
          await OrdersProduct.findByIdAndDelete(ordersProductId.toString())
        })
      )

      await Orders.findByIdAndDelete(id)

      res.status(204).json()
    } catch (error) {
      res.status(500).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }
}