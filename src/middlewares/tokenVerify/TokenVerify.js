require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, FORBIDDEN } = require("../../config/const");
const { send_response } = require("../../config/reponseObject");

const TokenVerify = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, valid) => {
      if (err) {
       const obj = {
            res,
            status: false,
            code: UNAUTHORIZED,
            errors: ["Your token is expired, please login again"],
          };
          return send_response(obj)
      } else {
        next();
      }
    });
  } else {
    const obj = {
        res,
        status: false,
        code: FORBIDDEN,
        errors: ["Please add token in header"],
      };
      return send_response(obj)
  }
};

module.exports = TokenVerify;
