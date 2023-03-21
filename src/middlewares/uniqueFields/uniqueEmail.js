require("dotenv").config();
const { INTERNAL_SERVER_ERROR, CONFLICT } = require("../../config/const");
const pool = require("../../connection/db");

const uniqueEmail = async (req, res, next) => {
  if (req.body.staff_id !== undefined) {
    var sql = `SELECT * FROM wca_staff WHERE email=? AND staff_id != ?`;
    var sqlValues = [req.body.email, req.body.staff_id];
  } else {
    sql = `SELECT * FROM wca_users WHERE email=? AND customer_id != ?`;
    sqlValues = [req.body.email, req.body.customer_id];
  }

  pool.query(sql, sqlValues, (err, result) => {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: false,
        code: INTERNAL_SERVER_ERROR,
        message: "",
        errors:
          req.body.staff_id !== undefined
            ? ["Unable to save staff member's details"]
            : ["Unable to save customer details"],
      });
    }
    if (result.length) {
      return res.status(CONFLICT).json({
        status: false,
        code: CONFLICT,
        message: "",
        errors: ["Email already exists"],
      });
    } else {
      next();
    }
  });
};

module.exports = uniqueEmail;
