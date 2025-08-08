const Joi = require("joi");

const postSchema = Joi.object({
  content: Joi.string().required().messages({
    "string.base": "მხოლოდ სტრინგს ველოდები",
    "any.required": "კონტენტი  აუცილებელია",
  }),
  title: Joi.string().required().messages({
    "string.base": "მხოლოდ სტრინგს ველოდები",
    "any.required": "სათაური  აუცილებელია",
  }),
  user_id: Joi.number().required().messages({
    "number.base": "მხოლოდ რიცხვს ველოდები",
    "any.required": "იუზერის ID  აუცილებელია",
  }),
});
module.exports = postSchema;
