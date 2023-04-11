const Joi = require("joi");
const { PRECONDITION_FAILED } = require("../config/const");
const TokenVerify = require("../middlewares/tokenVerify/TokenVerify");
const { send_response } = require("../config/reponseObject");

const customerValidation = async (req, res, next) => {
  delete req.body.confirm_password;

  const schema = Joi.object({
    customer_id: Joi.string().allow(null, ""),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required().min(1000000000).max(9999999999),
    address: Joi.string().required(),
    password: Joi.string().required().allow(null, ""),
    user_type: Joi.number().required(),
    createdOn: Joi.date().allow(null, ""),
    vehicles: Joi.number().allow(null, ""),
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
    if (Number(req.body.user_type) !== 1 && req.body.customer_id === "") {
      next();
    } else {
      await TokenVerify(req, res, next);  //this is middleware called inside a function and next() call in tokenVerify
    }
  }
};

module.exports = customerValidation;
