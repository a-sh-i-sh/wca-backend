const { INTERNAL_SERVER_ERROR, CONFLICT } = require("../../config/const");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");

const uniqueVIN = async (req,res,next) => {
  if(req.body.vehicles_id !== ""){
    var sql = `SELECT * FROM wca_negotiating_vehicles WHERE vin=? AND vehicles_id !=?`;
    var sqlValues = [req.body.vin,req.body.vehicles_id];
  }else{
    sql = `SELECT * FROM wca_negotiating_vehicles WHERE vin=?`;
    sqlValues = [req.body.vin];
  }
    await pool.query(sql, sqlValues, (err, result) => {
        if (err) {
          return send_sqlError(res)
            // return res.status(INTERNAL_SERVER_ERROR).json({
            //     status: false,
            //     code: INTERNAL_SERVER_ERROR,
            //     message: "",
            //     errors: "Unable to save vehicle's detail"
            // })
        }
        else if (result.length && (result[0].is_deleted === 0)) {
            const obj = {
              res,
              status: false,
              code: CONFLICT,
              errors: ["VIN number already exist"],
            };
            return send_response(obj)
          } else if(result.length && (result[0].is_deleted === 1) && (req.body.vehicles_id === "")) {
            // we need to update operation. so call updateVehicles(req,res); is_deleted = 0
            // console.log(result[0]);
            Object.assign(req.body, { vehicles_id : result[0].vehicles_id, createdOn: result[0].createdOn });
            next();
          } else {
            next();
          }
    })
}

module.exports = uniqueVIN;