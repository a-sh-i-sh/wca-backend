require("dotenv").config();
const pool = require("../../connection/db");

const uniqueEmail = async (req, res, next) => {
  // if(req.body.staff_id){
    var sql = `SELECT * FROM wca_staff WHERE email=? AND staff_id != ?`;
    var sqlValues = [req.body.email, req.body.staff_id];
  // } else {
    // sql = `SELECT * FROM wca_staff WHERE email=?`;
    // sqlValues = [req.body.email]
  // }
  
  pool.query(sql, sqlValues, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(statusCodes.RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Unable to save staff member's details ",
        errors:["Unable to save staff member's details"]
      });
    }
    if (result.length) {
      return res.status(statusCodes.RESPONSE_CODES.CONFLICT).json({
        status: false,
        message: "Email already exists",
        errors:["Unable to save staff member's details"]
      });
    } else {
      next();
    }
  });
};

module.exports = uniqueEmail;
