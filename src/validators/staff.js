const Joi = require("joi");
const { PRECONDITION_FAILED } = require("../config/const");
const { send_response } = require("../config/reponseObject");

const staffValidation = async (req, res, next) => {
  delete req.body.confirm_password;

  const schema = Joi.object({
    staff_id: Joi.string().allow(null, ""),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.number().required().min(1000000000).max(9999999999),
    type: Joi.string().required(),
    password: Joi.string().required().allow(null, ""),
    createdOn: Joi.date().allow(null, ""),
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

module.exports = staffValidation;
