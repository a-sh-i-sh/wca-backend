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
      return res.status(500).json({
        status: false,
        message: "Unable to save staff member's details ",
      });
    }
    if (result.length) {
      return res.status(409).json({
        status: false,
        message: "Email already exists",
      });
    } else {
      next();
    }
  });
};

module.exports = uniqueEmail;
