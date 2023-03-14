const { validate, Joi } = require('express-validation')

module.exports = validate({
  body: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    categoryid: Joi.required()
  })
})
