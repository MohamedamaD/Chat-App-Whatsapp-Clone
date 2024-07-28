const Joi = require("joi");

const userValidator = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  avatar: Joi.string().optional(),
  about: Joi.string().optional(),
});

module.exports = userValidator;
