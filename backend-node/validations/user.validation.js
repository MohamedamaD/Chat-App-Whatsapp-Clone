const Joi = require("joi");

const userValidator = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.min": "Please enter a name with at least 3 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 3 characters and contain both numbers and letters",
      "any.required": "Password is required",
    }),
  avatar: Joi.string().optional(),
  about: Joi.string().optional(),
});


module.exports = userValidator;
