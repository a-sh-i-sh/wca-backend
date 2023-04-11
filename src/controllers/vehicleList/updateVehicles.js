const {
  INTERNAL_SERVER_ERROR,
  CREATED,
  PROMPT_CODE,
  OK_AND_COMPLETED,
  OK_WITH_CONFLICT,
  BAD_REQUEST,
  OK,
} = require("../../config/const");
const { DecryptedData } = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");
const Blackbook = require("../../middlewares/Blackbook/Blackbook");
const MarketCheckUsedCar = require("../../middlewares/Marketcheck/MarketPrice");
const VehicleDetail = require("../../middlewares/NHTSA/VehicleDetail");

const updateVehicles = async (req, res) => {
  if (req.body.createdOn !== undefined) {
    // please update the createdOn & is_deleted replace by 0 and its other data (Which Already deleted)
    try {
      const created_on = new Date();
      const bdata = VehicleDetail(req.body.vin);
      if(bdata === 400){
        const obj ={
          res,
          status: true,
          code: BAD_REQUEST,
          errors: ["Uable to fetch data from MarketChek api"]
        }
        return send_response(obj)
      }
      const sql = `update wca_negotiating_vehicles set make=?,year=?,model=?,createdOn=?,is_deleted=? where vin=? AND vehicles_id=?`;
      const sqlValues = [
        bdata.make,
        bdata.year,
        bdata.model,
        created_on,
        0,
        req.body.vin,
        req.body.vehicles_id,
      ];
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
    } catch (err) {
      const obj = {
        res,
        status: false,
        code: INTERNAL_SERVER_ERROR,
        errors: ["Unable to add vehicle in the list"],
      };
      return send_response(obj);
    }
  } else {
    // please update the other data of vin (Whose is_deleted is 0)
    try {
      const bData = VehicleDetail(req.body.vin);
      if(bdata === 400){
        const obj ={
          res,
          status: true,
          code: BAD_REQUEST,
          errors: ["Uable to fetch data from MarketChek api"]
        }
        return send_response(obj)
      }
      const sql = `update wca_negotiating_vehicles set make=?,year=?,model=?, where vehicles_id`;
      const sqlValues = [
        bData.make,
        bData.year,
        bData.model,
        req.body.vehicles_id,
      ];

      await pool.query(sql, sqlValues, (err, result) => {
        if (err) {
          return send_sqlError(res);
        } else if (result.affectedRows) {
          const obj = {
            res,
            status: true,
            code: OK,
            message: "Vehicle details update successfully",
          };
          return send_response(obj);
        } else {
          const obj = {
            res,
            status: false,
            code: BAD_REQUEST,
            errors: [
              "Unable to update vehicles details",
              "May be different cause for not updating",
            ],
          };
          return send_response(obj);
        }
      });
    } catch (err) {
      const obj = {
        res,
        status: false,
        code: INTERNAL_SERVER_ERROR,
        errors: ["Unable to update vehicles details"],
      };
      return send_response(obj);
    }
  }
};

module.exports = updateVehicles;
