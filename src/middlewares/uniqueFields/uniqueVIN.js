const { INTERNAL_SERVER_ERROR, CONFLICT } = require("../../config/const");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");
const updateVehicles = require("../../controllers/vehicleList/updateVehicles");

const uniqueVIN = async (req,res,next) => {
    const sql = `SELECT * FROM wca_negotiating_vehicles WHERE vin=?`;
    await pool.query(sql, [req.body.vin], (err, result) => {
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
          } else if(result.length && (result[0].is_deleted === 1)) {
            // we need to update operation. so call updateVehicles(req,res); is_deleted = 0
            // console.log(result[0]);
            Object.assign(req.body, { vehicles_id : result[0].vehicles_id, createdOn: result[0].createdOn });
            updateVehicles(req, res);
          } else {
            next();
          }
    })
}

module.exports = uniqueVIN;