const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../connection/db");
const uuid = require('uuid')
const { registerValidation } = require("../../validators/auth");
// const uniqueidentifier = NEWID()
const createuser = async (req, res) => {
  delete req.body.confirm_password;

  // Validate registeration form data
  const { error } = await registerValidation(req.body);
  if (error) {
    return res
      .status(422)
      .send({ status: false, message: error.details[0].message });
  }

  // duplicate email address error
  const sql = "SELECT * FROM wca_users WHERE email = ?";
  const emailID = req.body.email;
  await pool.query(sql, [emailID], async (err, result) => {
    if (err) {
      await res.status(statusCodes.RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Unable to create account",
        errors: [err]
      });
    }
    if (result.length !== 0) {
      await res.status(statusCodes.RESPONSE_CODES.BAD_REQUEST).json({
        status: false,
        message: "Email address already used",
        errors: []
      });
    }
  });

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;
  const id = uuid.v4()

  try {
    Object.assign(req.body,{id:id})
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const sql = `INSERT INTO wca_users (${keys}) VALUES (?)`;
    await pool.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(statusCodes.RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
          status: false,
          message: "Unable to create account",
          errors: [err]
        });
      }
      console.log("record inserted", result);
      res.header("auth-user").status(statusCodes.RESPONSE_CODES.OK).json({
        status: true,
        message: "Account has been created successfully",
        errors: []
      });
    });
  } catch (error) {
    console.log(error);
    res.status(statusCodes.RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Unable to create account",
      errors: [error]
    });
  }
};

module.exports = { createuser };
