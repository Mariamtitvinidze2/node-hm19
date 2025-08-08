const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(6).max(20).required().messages({
    "string.base": "მხოლოდ სტრინგს ველოდები",
    "string.min": "მინიმუმია 6",
    "string.max": "მაქსიმუმი 6",
    "any.required": "სრული სახელი აუცილებელია",
  }),
  email: Joi.string().email().required(),
});
module.exports = userSchema;
