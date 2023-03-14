require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require('uuid')
const pool = require("../../connection/db");
const {
  loginValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
} = require("../../validators/auth");

const login = async (req, res) => {
  // Validate login form data
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(422)
      .send({ status: false, message: error.details[0].message });
  }

  // Searching user detail for matching credential
  const sql = "SELECT * FROM wca_info WHERE email = ?";
  const emailID = req.body.email;
  await pool.query(sql, [emailID], async (err, result) => {
    if (err) {
      await res.status(500).json({
        status: false,
        message: "Unable to login your account",
        // errors: err.sqlMessage
      });
    }
    
    if (result?.length === 0) {
      await res.status(400).json({
        status: false,
        message: "Email address don't exits, please create account first",
      });
    } else {
      const userMatch = result[0];
      const submittedPass = req.body.password;
      const savedPass = userMatch.password;

      // Compare hash and plain password
      const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
      if (passwordDidMatch) {
        // Create and assign new token
        const token = jwt.sign(
          {
            id: userMatch.id
          },
          process.env.TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        res.header("auth-token", token).json({
          status: true,
          message: `Login successfully`,
          token: token,
          
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid username or password",
        });
      }
    }
  });
};

module.exports = { login };
