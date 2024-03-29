const Joi = require("joi");
const { PRECONDITION_FAILED } = require("../config/const");
const { send_response } = require("../config/reponseObject");

const registerValidation = async (req, res, next) => {
  delete req.body.confirm_password;

  const schema = Joi.object({
    id: Joi.string().allow(null, ""),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required().min(1000000000).max(9999999999),
    password: Joi.string().required().allow(null, ""),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    const obj = {
      res,
      status: false,
      code: PRECONDITION_FAILED,
      errors: error.details.map((item) => {
        return item.message;
      }),
    };
    send_response(obj)
  } else {
    next();
  }
};

const loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    user_type: Joi.number().required(),
  });
  const { error } = await schema.validate(req.body);
  if (error) {
    const obj = {
      res,
      status: false,
      code: PRECONDITION_FAILED,
      errors: error.details.map((item) => {
        return item.message;
      }),
    };
    send_response(obj)
  } else {
    next();
  }
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
