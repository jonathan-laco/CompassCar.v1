const Joi = require("joi");

const createCarSchema = Joi.object({
  brand: Joi.string().required().messages({
    "string.base": `"brand" should be a type of 'text'`,
    "any.required": `"brand" is a required field`,
  }),
  model: Joi.string().required().messages({
    "string.base": `"model" should be a type of 'text'`,
    "any.required": `"model" is a required field`,
  }),
  year: Joi.number().integer().min(2015).max(2025).required().messages({
    "number.base": `"year" should be a type of 'number'`,
    "number.min": `"year" should be greater than or equal to 2015`,
    "number.max": `"year" should be less than or equal to 2025`,
    "any.required": `"year" is a required field`,
  }),
  items: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    "array.base": `"items" should be an array`,
    "array.min": `"items" must contain at least one non-empty item`,
    "any.required": `"items" is a required field`,
  }),
});

const updateCarSchema = Joi.object({
  brand: Joi.string().optional(),
  model: Joi.string().optional(),
  year: Joi.number().integer().min(2015).max(2025).optional(),
  items: Joi.array().items(Joi.string().min(1)).min(1).optional().messages({
    "array.base": `"items" should be an array`,
    "array.min": `"items" must contain at least one non-empty item`,
  }),
});

module.exports = { createCarSchema, updateCarSchema };
