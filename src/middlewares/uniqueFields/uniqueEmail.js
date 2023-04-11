require("dotenv").config();
const { INTERNAL_SERVER_ERROR, CONFLICT } = require("../../config/const");
const { DecryptedData } = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");
const { updateCustomer } = require("../../controllers/customers/customers");
const { updateStaff } = require("../../controllers/staff/staff");

const uniqueEmail = async (req, res, next) => {
  console.log("req.body",req.body)
  if (req.body.staff_id !== undefined) {
    var sql = `SELECT * FROM wca_staff WHERE email=? AND staff_id != ?`;
    var sqlValues = [req.body.email, req.body.staff_id];
  } else {
    sql = `SELECT * FROM wca_users WHERE email=? AND customer_id != ?`;
    sqlValues = [req.body.email, req.body.customer_id];
  }

  await pool.query(sql, sqlValues, (err, result) => {
    if (err) {
      return send_sqlError(res)
      // return res.status(INTERNAL_SERVER_ERROR).json({
      //   status: false,
      //   code: INTERNAL_SERVER_ERROR,
      //   errors:
      //     req.body.staff_id !== undefined
      //       ? ["Unable to save staff member's details"]
      //       : ["Unable to save customer details"],
      // });
    }
    else if(result.length && (result[0].is_deleted === 0)) {
      const obj = {
        res,
        status: false,
        code: CONFLICT,
        errors: ["Email already exist"],
      };
      return send_response(obj)
    } else if(result.length && (result[0].is_deleted === 1)) {
      if(req.body.staff_id !== undefined){
        Object.assign(req.body,{staff_id: result[0].staff_id, createdOn: result[0].createdOn}) // staff_id/customer_id direct from database(without encrypt)
        updateStaff(req,res);
      }else{
        Object.assign(req.body,{customer_id: result[0].customer_id, createdOn: result[0].createdOn})
        updateCustomer(req,res);
      }
    } else {
      next();
    }
  });
};

module.exports = uniqueEmail;
