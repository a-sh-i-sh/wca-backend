const Joi = require("joi");

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
    return res
      .status(422)
      .json({ status: false, message: error.details[0].message });
  } else {
    next();
  }
};

module.exports = staffValidation;
