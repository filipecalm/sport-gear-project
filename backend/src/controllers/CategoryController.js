const { Category } = require('../models')
const MESSAGE = require('../constants/messages')

module.exports = class CategoryController {
  static async createCategory(req, res) {
    try {
      const { name } = req.body
      // validação
      if (!name) {
        return res.status(400).json(MESSAGE.ERROR.CATEGORY.EMPTY_NAME_ERROR)
      }

      const nameExists = await Category.findOne({ name })

      if (nameExists) {
        return res.status(400).json(MESSAGE.ERROR.CATEGORY.NAME_ALREADY_EXISTS)
      }

      const category = new Category({
        name
      })

      const NewCategory = await category.save()

      res.status(200).json(NewCategory)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params
      const category = await Category.findById(id)

      res.status(200).json(category)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async listCategories(req, res) {
    try {
      const list = await Category.find()

      res.status(200).json(list)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params
      const { name } = req.body

      if (!name) {
        return res.status(400).json(MESSAGE.ERROR.CATEGORY.EMPTY_NAME_ERROR)
      }

      const existingCategory = await Category.findOne({ name })

      if (existingCategory && existingCategory._id != id) {
        return res.status(400).json(MESSAGE.ERROR.CATEGORY.NAME_ALREADY_EXISTS)
      }

      const update = await Category.findByIdAndUpdate(id, { name })

      res.status(201).json(MESSAGE.SUCCESS.CATEGORY.UPDATED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }


  static async deleteCategory(req, res) {
    try {
      const { id } = req.params

      const deleteById = await Category.findByIdAndRemove(id)
      if (!deleteById) {
        return res.status(404).json(MESSAGE.ERROR.CATEGORY.DELETE)
      }

      res.json(MESSAGE.SUCCESS.CATEGORY.DELETED)
    } catch (error) {
      res.status(400).json(MESSAGE.ERROR.ERROR_CATCH)
    }
  }
}