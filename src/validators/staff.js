const Joi = require("joi");

const staffValidation = async (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required().min(1000000000).max(9999999999),
    type: Joi.string().required(),
    password: Joi.string().required(),
  });
  return await schema.validate(data);
};

module.exports = {staffValidation}