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

const creatingStaff = async (req, res, next) => {
  delete req.body.confirm_password;

  if (req.body.staff_id === "") {
    const staff_id = uuid.v4();
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    try {
      req.body.staff_id = staff_id;
      const createdOn = new Date();
      Object.assign(req.body, { createdOn });
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const sql = `INSERT INTO wca_staff (${keys}) VALUES (?)`;
      await pool.query(sql, [values], (err, result) => {
        if (err) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            code: INTERNAL_SERVER_ERROR,
            message: "",
            errors: ["Unable to add as a staff member"],
          });
        }
        if (result.affectedRows) {
          return res.status(CREATED).json({
            status: true,
            code: CREATED,
            message: "Staff member added successfully",
            errors: [],
          });
        } else {
          return res.json({
            status: false,
            code: PROMPT_CODE,
            message: "",
            errors: ["Unable to add as a staff member"],
          });
        }
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: false,
        code: INTERNAL_SERVER_ERROR,
        message: "",
        errors: ["Unable to add as a staff member"],
      });
    }
  } else {
    next();
  }
};

const updateStaff = async (req, res) => {
  delete req.body.confirm_password;
  if (req.body.password) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    var sql = `update wca_staff set firstName=?,lastName=?,phone=?,email=?,type=?,password=? where staff_id = ?`;
    var sqlValues = [
      req.body.firstName,
      req.body.lastName,
      req.body.phone,
      req.body.email,
      req.body.type,
      req.body.password,
      req.body.staff_id,
    ];
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
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: false,
        code: INTERNAL_SERVER_ERROR,
        message: "",
        errors: ["Unable to update staff member's details"],
      });
    }
    if (result.affectedRows) {
      return res.status(OK_AND_COMPLETED).json({
        status: true,
        code: OK_AND_COMPLETED,
        message: "Staff member updated successfully",
        errors: [],
      });
    } else {
      return res.json({
        status: false,
        code: BAD_REQUEST,
        message: "",
        errors: ["Invalid staff id"],
      });
    }
  });
};

const getAll = (search,staff_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wca_staff WHERE staff_id != '${staff_id}' 
  AND ( firstName LIKE '%${search}%'
  OR lastName LIKE '%${search}%'
  OR email LIKE '%${search}%'
  OR type LIKE '%${search}%'
  OR phone LIKE '%${search}%' )`;
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

    const total_records = await getAll(search,req.body.staff_id);
    const pages =
      total_records % limit === 0
        ? Math.trunc(total_records / limit)
        : Math.trunc(total_records / limit) + 1;

    const sql = `SELECT *,DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') AS createdOn FROM wca_staff WHERE staff_id != '${req.body.staff_id}'
AND ( firstName LIKE '%${search}%'
OR lastName LIKE '%${search}%'
OR email LIKE '%${search}%'
OR type LIKE '%${search}%'
OR phone LIKE '%${search}%' )
ORDER BY ${sortColumn} ${sort}
LIMIT ${skip},${limit}`;
    await pool.query(sql, (err, result) => {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          status: false,
          code: INTERNAL_SERVER_ERROR,
          message: "",
          errors: ["Unable to fetch Staff List"],
        });
      }
      if (result.length) {
        return res.json({
          status: true,
          code: OK_AND_COMPLETED,
          message: "Staff List found successfully",
          staff_list: result,
          page,
          pages,
          page_records: result.length,
          total_records,
          errors: [],
        });
      } else {
        return res.json({
          status: false,
          code: OK_WITH_CONFLICT,
          message: "",
          staff_list: result,
          page,
          pages,
          page_records: result.length,
          total_records,
          errors: ["No record found"],
        });
      }
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({
      status: false,
      code: INTERNAL_SERVER_ERROR,
      message: "",
      errors: ["Unable to fetch Staff List"],
    });
  }
};
const getStaffById = async (req, res) => {
  if (req.body.staff_id) {
    await pool.query(
      `select staff_id,firstName,lastName,phone,email,type from wca_staff where staff_id = ?`,
      [req.body.staff_id],
      (error, results, fields) => {
        if (error) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            code: INTERNAL_SERVER_ERROR,
            message: "",
            errors: ["Unable to fetch Staff member details"],
          });
        }
        if (results.length) {
          return res.status(OK_AND_COMPLETED).json({
            status: true,
            code: OK_AND_COMPLETED,
            message: "Staff member details fetch successfully",
            data: results[0],
            errors: [],
          });
        } else {
          return res.json({
            status: false,
            code: BAD_REQUEST,
            message: "",
            errors: ["Invalid staff id"],
          });
        }
      }
    );
  } else {
    return res.json({
      status: false,
      code: BAD_REQUEST,
      message: "",
      errors: ["Invalid staff id"],
    });
  }
};
const deleteStaffById = async (req, res) => {
  if (req.body.staff_id) {
    await pool.query(
      `DELETE  from wca_staff where staff_id = ?`,
      [req.body.staff_id],
      (error, results, fields) => {
        if (error) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            code: INTERNAL_SERVER_ERROR,
            message: "",
            errors: ["Unable to removed Staff member"],
          });
        }
        if (results.affectedRows) {
          return res.json({
            status: true,
            code: OK,
            message: "Staff member removed Successfully",
            errors: [],
          });
        } else {
          return res.json({
            status: false,
            code: OK_WITH_CONFLICT,
            message: "",
            errors: ["Staff member do not exists"],
          });
        }
      }
    );
  } else {
    return res.json({
      status: false,
      code: BAD_REQUEST,
      message: "",
      errors: ["Invalid staff id"],
    });
  }
};
module.exports = {
  creatingStaff,
  getStaffList,
  getStaffById,
  updateStaff,
  deleteStaffById,
};
