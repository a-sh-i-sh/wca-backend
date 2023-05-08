require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../connection/db");
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  SEE_OTHER,
  OK,
} = require("../../config/const");
const { EncryptedData, DecryptedData } = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");

const login = async (req, res) => {
  const user_type = Number(req.body.user_type);

  if (user_type === 1) {
    var sql = "SELECT * FROM wca_staff WHERE email = ?";
  } else if (user_type === 2) {
    sql = "SELECT * FROM wca_users WHERE email = ?";
  } else {
    const obj = {
      res,
      status: false,
      code: BAD_REQUEST,
      errors: ["Please provide correct user_type 1 or 2"],
    };
    send_response(obj)
  }
  // Searching user detail for matching credential
  const emailID = req.body.email;
  await pool.query(sql, [emailID], async (err, result) => {
    if (err) {
      console.log("madam ",err);
      send_sqlError(res)
    }
    if (result?.length === 0) {
      const obj = {
        res,
        status: false,
        code: BAD_REQUEST,
        errors: [
          user_type === 1
            ? "Admin does not exist"
            : "Email address doesn't exist, please create account first",
        ],
      }
      send_response(obj)
    } else {
      (user_type === 1)? delete Object.assign(result[0], {id: result[0].staff_id})['staff_id'] : delete Object.assign(result[0], {id: result[0].customer_id})['customer_id'];
      result[0].id = EncryptedData(result[0].id);
      const userMatch = result[0];
      const submittedPass = req.body.password;
      const savedPass = userMatch.password;
      
      // Compare hash and plain password
      const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
      if (passwordDidMatch) {
        // Create and assign new token
        const token = jwt.sign(
          {
            id: userMatch.id,
          },
          process.env.TOKEN_SECRET_KEY,
          { expiresIn: "1d" }
        );

        res.header("auth-token", token).json({
          status: true,
          code: OK,
          message: `Login successful`,
          token: token,
          id: userMatch.id,
          errors: [],
        });
      } else {
        const obj = {
          res,
          status: false,
          code: SEE_OTHER,
          errors: ["Invalid email or password"],
        };
        send_response(obj);
      }
    }
  });
};

module.exports = { login };