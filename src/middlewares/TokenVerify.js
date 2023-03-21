require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, FORBIDDEN } = require("../config/const");

const TokenVerify = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, valid) => {
      if (err) {
        res.json({
            status: false,
            code: UNAUTHORIZED,
            messages: "",
            errors: ["Your token is expired, please login again"],
          });
      } else {
        next();
      }
    });
  } else {
    res.json({
        status: false,
        code: FORBIDDEN,
        messages: "",
        errors: ["Please add token in header"],
      });
  }
};

module.exports = TokenVerify;
