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
  const sql = "SELECT * FROM wca_info WHERE email = ?";
  const emailID = req.body.email;
  await pool.query(sql, [emailID], async (err, result) => {
    if (err) {
      await res.status(500).json({
        status: false,
        message: "Unable to create account",
        // errors: err.sqlMessage
      });
    }
    if (result.length !== 0) {
      await res.status(400).json({
        status: false,
        message: "Email address already used"
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
    console.log(req.body);
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const sql = `INSERT INTO wca_info (${keys}) VALUES (?)`;
    await pool.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: false,
          message: "Unable to create account",
          // errors: err.sqlMessage
        });
      }
      console.log("record inserted", result);
      res.header("auth-user").status(201).json({
        status: true,
        message: "Account has been created successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Unable to create account",
    });
  }
};

module.exports = { createuser };
