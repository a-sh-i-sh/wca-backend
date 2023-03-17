require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const pool = require("../../connection/db");

const login = async (req, res) => {
  const user_type = Number(req.body.user_type);
  
  if (user_type === 1) {
    var sql = "SELECT * FROM wca_staff WHERE email = ?";
  } else if (user_type === 2) {
    sql = "SELECT * FROM wca_users WHERE email = ?";
  } else {
    return res.status(500).json({
      status: false,
      message: "Please provide correct user_type 1 or 2",
      errors:["Please provide correct user_type 1 or 2"]
    });
  }

  // Searching user detail for matching credential
  const emailID = req.body.email;
  await pool.query(sql, [emailID], async (err, result) => {
    if (err) {
      res.status(500).json({
        status: false,
        message: "Unable to login your account",
        errors:["Unable to login your account"]
      });
    }
    if (result?.length === 0) {
      res.status(400).json({
        status: false,
        message:
          user_type === 1
            ? "You are not an admin"
            : "Email address don't exists, please create account first",
          errors:[ user_type === 1
            ? "You are not an admin"
            : "Email address don't exists, please create account first"]
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
            id: userMatch.staff_id,
          },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "1d" }
        );
        
        res.header("auth-token", token).json({
          status: true,
          message: `Login successfully`,
          token: token,
          id: userMatch.staff_id,
          errors:[]
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid email or password",
          errors:[ "Invalid email or password"]
        });
      }
    }
  });
};

module.exports = { login };
