const Joi = require("joi");

const registerValidation = async (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required().min(1000000000).max(9999999999),
    password: Joi.string().required(),
  });
  return await schema.validate(data);
};

const loginValidation = async (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return await schema.validate(data);
};

const forgetPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });

  return schema.validate(data);
};

const resetPasswordValidation = async (data) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });

  return await schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  forgetPasswordValidation,
};
