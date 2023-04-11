const {
  INTERNAL_SERVER_ERROR,
  CREATED,
  PROMPT_CODE,
  OK_AND_COMPLETED,
  OK_WITH_CONFLICT,
  BAD_REQUEST,
} = require("../../config/const");
const {
  EncryptedData,
  DecryptedData,
} = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");

const AddVehicles = async (req, res) => {
  try {
    const createdOn = new Date();
    Object.assign(req.body, { createdOn });
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const sql = `INSERT INTO wca_negotiating_vehicles (${keys}) VALUES (?)`;
    await pool.query(sql, [values], (err, result) => {
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
};

const getAll = (search) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wca_negotiating_vehicles WHERE is_deleted = 0
    AND ( vin LIKE '%${search}%'
    OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%' )`;
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.length);
    });
  });
};

const getVehiclesList = async (req, res) => {
  try {
    const page = req.body.page ? Number(req.body.page) : 1;
    const limit = req.body.limit ? Number(req.body.limit) : 5;
    const skip = (page - 1) * limit;
    const sortColumn = req.body.sortColumn ? req.body.sortColumn : "createdOn";
    const sort = req.body.sort;
    const search = req.body.search ? req.body.search : "";

    const total_records = await getAll(search);
    const pages =
      total_records % limit === 0
        ? Math.trunc(total_records / limit)
        : Math.trunc(total_records / limit) + 1;

    const sql = `SELECT vehicles_id,vin, DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p')
      AS created_on FROM wca_negotiating_vehicles WHERE is_deleted = 0
  AND ( vin LIKE '%${search}%'
  OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%' )
  ORDER BY ${sortColumn} ${sort}
  LIMIT ${skip},${limit}`;
    await pool.query(sql, (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to fetch Vehicles List"],
        // });
      }

      if (result.length) {
        result.map((item, index) => {
          item.vehicles_id = EncryptedData(item.vehicles_id);
        });
      }
      const obj = {
        res,
        status: true,
        code: OK_AND_COMPLETED,
        message: result?.length
          ? "Vehicles List found successfully"
          : "No record found",
        data: {
          vehicles_list: result,
          page,
          pages,
          page_records: result.length,
          total_records,
        },
      };
      return send_response(obj);
    });
  } catch (error) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to fetch Vehicles List"],
    };
    return send_response(obj);
  }
};

const getVehiclesById = async (req, res) => {
  try {
    const sql = `Select vin from wca_negotiating_vehicles where is_deleted = 0 AND vehicles_id = ?`;
    await pool.query(sql, [decrypt_id], async (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to get vehicle details"],
        // });
      }
      if (result.length) {
        Object.assign(result[0], { vehicles_id: req.body.vehicles_id });
        const obj = {
          res,
          status: true,
          code: OK_AND_COMPLETED,
          message: "Vehicle details found successfully",
          data: result[0],
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors: ["Invalid vehicles id"],
        };
        return send_response(obj);
      }
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to get vehicle details"],
    };
    return send_response(obj);
  }
};

const deleteVehiclesById = async (req, res) => {
  try {
    const sql = `update wca_negotiating_vehicles set is_deleted=? where vehicles_id=?`;
    await pool.query(sql, [1, req.body.vehicles_id], async (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to remove vehicle from list"],
        // });
      }
      if (result.affectedRows) {
        const obj = {
          res,
          status: true,
          code: OK_AND_COMPLETED,
          message: "Vehicle removed successfully",
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors: ["Invalid vehicles id"],
        };
        return send_response(obj);
      }
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to remove vehicle from list"],
    };
    return send_response(obj);
  }
};

module.exports = {
  AddVehicles,
  getVehiclesList,
  getVehiclesById,
  deleteVehiclesById,
};
