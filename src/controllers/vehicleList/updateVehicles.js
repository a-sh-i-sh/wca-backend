const {
  INTERNAL_SERVER_ERROR,
  CREATED,
  PROMPT_CODE,
  OK_AND_COMPLETED,
  OK_WITH_CONFLICT,
  BAD_REQUEST,
} = require("../../config/const");
const { DecryptedData } = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");

const updateVehicles = async (req, res) => {
  console.log("body", req.body);
  if (req.body.createdOn !== undefined) {
    // please update the createdOn & is_deleted replace by 0 and its other data (Which Already deleted)
    const created_on = new Date();
    const sql = `update wca_negotiating_vehicles set createdOn=?, is_deleted=? where vin=?`;
    const sqlValues = [created_on, 0, req.body.vin];
    await pool.query(sql, sqlValues, (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to add vehicle in the list"],
        // });
      }
      if (result.affectedRows) {
        const obj = {
          res,
          status: true,
          code: CREATED,
          message: "Vehicle added successfully",
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: PROMPT_CODE,
          errors: ["Unable to add vehicle in the list"],
        };
        return send_response(obj);
      }
    });
    
  } else {
    // please update the other data of vin (Whose is_deleted is 0)
    const sql = `update wca_negotiating_vehicles set make=?,year=?,model=?,price=? where vehicles_id`;
    const sqlValues = [];

    await pool.query(sql,sqlValues,(err,result) => {
      if(err){
        return send_sqlError(res)
      }
      else if(result.affectedRows){

      }
      else{
        
      }
    })

    res.json({ status: "Vehicles updated successfully" });
  }
};

module.exports = updateVehicles;
