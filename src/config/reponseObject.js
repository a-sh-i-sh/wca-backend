// Four parameters essential to send.
// errors = array of strings

const { INTERNAL_SERVER_ERROR } = require("./const");

const send_response = async ({ res, status, code, message, data, errors }) => {
  res.json({
    status,
    code,
    message: message ? message : "",
    data,
    errors: errors ? errors : [],
  });
};

const send_sqlError = async (res) => {
  res.json({
    status: false,
    code: INTERNAL_SERVER_ERROR,
    message: "",
    errors: ["There is sql internal error"],
  });
};

module.exports = { send_response, send_sqlError };
