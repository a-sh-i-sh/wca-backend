const Joi = require("joi");
const { PRECONDITION_FAILED } = require("../config/const");
const { send_response } = require("../config/reponseObject");

const AddVehiclesValidation = async (req, res, next) => {

  const schema = Joi.object({
    vin: Joi.string().required(),
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

module.exports = AddVehiclesValidation;
