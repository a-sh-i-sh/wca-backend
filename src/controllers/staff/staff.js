require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../../connection/db");
const uuid = require("uuid");
const {
  INTERNAL_SERVER_ERROR,
  CREATED,
  PROMPT_CODE,
  OK_AND_COMPLETED,
  BAD_REQUEST,
  OK_WITH_CONFLICT,
  OK,
} = require("../../config/const");
const {
  DecryptedData,
  EncryptedData,
} = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");

const creatingStaff = async (req, res, next) => {
  delete req.body.confirm_password;

  if (req.body.staff_id === "") {
    delete req.body.staff_id;
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    try {
      const createdOn = new Date();
      Object.assign(req.body, { createdOn });
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const sql = `INSERT INTO wca_staff (${keys}) VALUES (?)`;
      await pool.query(sql, [values], (err, result) => {
        if (err) {
          return send_sqlError(res);
          // return res.status(INTERNAL_SERVER_ERROR).json({
          //   status: false,
          //   code: INTERNAL_SERVER_ERROR,
          //   message: "",
          //   errors: ["Unable to add as a staff member"],
          // });
        }
        if (result.affectedRows) {
          const obj = {
            res,
            status: true,
            code: CREATED,
            message: "Staff member added successfully",
          };
          return send_response(obj);
        } else {
          const obj = {
            res,
            status: false,
            code: PROMPT_CODE,
            errors: ["Unable to add as a staff member"],
          };
          return send_response(obj);
        }
      });
    } catch (error) {
      const obj = {
        res,
        status: false,
        code: INTERNAL_SERVER_ERROR,
        errors: ["Unable to add as a staff member"],
      };
      return send_response(obj);
    }
  } else {
    next();
  }
};

const updateStaff = async (req, res) => {
  delete req.body.confirm_password;
  try {
    if (req.body.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;

      if (req.body.createdOn !== undefined) {
        const created_on = new Date();
        var sql = `update wca_staff set firstName=?,lastName=?,phone=?,email=?,type=?,password=?,createdOn=?,is_deleted=? where staff_id = ?`;
        var sqlValues = [
          req.body.firstName,
          req.body.lastName,
          req.body.phone,
          req.body.email,
          req.body.type,
          req.body.password,
          created_on,
          0,
          req.body.staff_id,
        ];
      } else {
        sql = `update wca_staff set firstName=?,lastName=?,phone=?,email=?,type=?,password=? where staff_id = ?`;
        sqlValues = [
          req.body.firstName,
          req.body.lastName,
          req.body.phone,
          req.body.email,
          req.body.type,
          req.body.password,
          req.body.staff_id,
        ];
      }
    } else {
      sql = `update wca_staff set firstName=?,lastName=?,phone=?,email=?,type=? where staff_id = ?`;
      sqlValues = [
        req.body.firstName,
        req.body.lastName,
        req.body.phone,
        req.body.email,
        req.body.type,
        req.body.staff_id,
      ];
    }

    await pool.query(sql, sqlValues, async (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   errors: (req.body.createdOn !== undefined)? ["Unable to add as a staff member"] : ["Unable to update staff member's details"],
        // });
      }
      if (result.affectedRows) {
        const obj = {
          res,
          status: true,
          code: req.body.createdOn !== undefined ? CREATED : OK_AND_COMPLETED,
          message:
            req.body.createdOn !== undefined
              ? "Staff member added successfully"
              : "Staff member updated successfully",
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors: ["Unable to update staff member's details"],
        };
        return send_response(obj);
      }
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to update staff member's details"],
    };
    return send_response(obj);
  }
};

const getAll = (search, staff_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wca_staff WHERE is_deleted = 0 AND staff_id != '${staff_id}' 
  AND ( firstName LIKE '%${search}%'
  OR lastName LIKE '%${search}%'
  OR email LIKE '%${search}%'
  OR type LIKE '%${search}%'
  OR phone LIKE '%${search}%'
  OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%' )`;
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.length);
    });
  });
};

const getStaffList = async (req, res) => {
  try {
    const page = req.body.page ? Number(req.body.page) : 1;
    const limit = req.body.limit ? Number(req.body.limit) : 5;
    const skip = (page - 1) * limit;
    const sortColumn = req.body.sortColumn ? req.body.sortColumn : "createdOn";
    const sort = req.body.sort;
    const search = req.body.search ? req.body.search : "";

    const total_records = await getAll(search, req.body.staff_id);
    const pages =
      total_records % limit === 0
        ? Math.trunc(total_records / limit)
        : Math.trunc(total_records / limit) + 1;

    const sql = `SELECT staff_id,firstName,lastName,
    phone,email,type,DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p')
    AS created_on FROM wca_staff WHERE is_deleted = 0 AND staff_id != '${req.body.staff_id}'
AND ( firstName LIKE '%${search}%'
OR lastName LIKE '%${search}%'
OR email LIKE '%${search}%'
OR type LIKE '%${search}%'
OR phone LIKE '%${search}%'
OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%')
ORDER BY ${sortColumn} ${sort}
LIMIT ${skip},${limit}`;
    await pool.query(sql, (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to fetch Staff List"],
        // });
      }
      if (result.length) {
        result.map((item, index) => {
          item.staff_id = EncryptedData(item.staff_id);
        });
      }
      const obj = {
        res,
        status: true,
        code: OK_AND_COMPLETED,
        message: result?.length
          ? "Staff List found successfully"
          : "No record found",
        data: {
          staff_list: result,
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
      errors: ["Unable to fetch Staff List"],
    };
    return send_response(obj);
  }
};

const getStaffById = async (req, res) => {
  try {
    await pool.query(
      `select staff_id,firstName,lastName,phone,email,type from wca_staff where is_deleted = 0 AND staff_id = ?`,
      [req.body.staff_id],
      (error, results, fields) => {
        if (error) {
          return send_sqlError(res);
          // return res.status(INTERNAL_SERVER_ERROR).json({
          //   status: false,
          //   code: INTERNAL_SERVER_ERROR,
          //   message: "",
          //   errors: ["Unable to fetch Staff member details"],
          // });
        }
        if (results.length) {
          results[0].staff_id = EncryptedData(results[0].staff_id);
        }
        const obj = {
          res,
          status: true,
          code: OK_AND_COMPLETED,
          message: results?.length
            ? "Staff member details fetch successfully"
            : "No record found",
          data: results?.length ? results[0] : results,
        };
        return send_response(obj);
      }
    );
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to fetch Staff member details"],
    };
    return send_response(obj);
  }
};
const deleteStaffById = async (req, res) => {
  try {
    const sql = `update wca_staff set is_deleted=? where staff_id=?`;
    await pool.query(sql, [1, req.body.staff_id], (error, results) => {
      if (error) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to removed Staff member"],
        // });
      }
      if (results.affectedRows) {
        const obj = {
          res,
          status: true,
          code: OK,
          message: "Staff member removed Successfully",
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors: ["Staff member does not exist"],
        };
        return send_response(obj);
      }
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to remove Staff member"],
    };
    return send_response(obj);
  }
};
module.exports = {
  creatingStaff,
  getStaffList,
  getStaffById,
  updateStaff,
  deleteStaffById,
};
