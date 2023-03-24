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

const creatingCustomer = async (req, res, next) => {
  delete req.body.confirm_password;
  delete req.body.user_type;

  if (req.body.customer_id === "") {
    const customer_id = uuid.v4();
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    try {
      req.body.customer_id = customer_id;
      const createdOn = new Date();
      Object.assign(req.body, { createdOn });
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const sql = `INSERT INTO wca_users (${keys}) VALUES (?)`;

      await pool.query(sql, [values], (err, result) => {
        if (err) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            code: INTERNAL_SERVER_ERROR,
            message: "",
            errors: ["Unable to save customer details"],
          });
        }
        if (result.affectedRows) {
          return res.status(CREATED).json({
            status: true,
            code: CREATED,
            message: "Customer added successfully",
            errors: [],
          });
        } else {
          return res.json({
            status: false,
            code: PROMPT_CODE,
            message: "",
            errors: ["Unable to save customer details"],
          });
        }
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: false,
        code: INTERNAL_SERVER_ERROR,
        message: "",
        errors: ["Unable to save customer details"],
      });
    }
  } else {
    next();
  }
};

const updateCustomer = async (req, res) => {
  delete req.body.confirm_password;
  delete req.body.user_type;

  if (req.body.password) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    var sql = `update wca_users set firstName=?,lastName=?,phone=?,email=?,address=?,password=? where customer_id = ?`;
    var sqlValues = [
      req.body.firstName,
      req.body.lastName,
      req.body.phone,
      req.body.email,
      req.body.address,
      req.body.password,
      req.body.customer_id,
    ];
  } else {
    sql = `update wca_users set firstName=?,lastName=?,phone=?,email=?,address=? where customer_id = ?`;
    sqlValues = [
      req.body.firstName,
      req.body.lastName,
      req.body.phone,
      req.body.email,
      req.body.address,
      req.body.customer_id,
    ];
  }

  await pool.query(sql, sqlValues, async (err, result) => {
    if (err) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: false,
        code: INTERNAL_SERVER_ERROR,
        message: "",
        errors: ["Unable to update customer details"],
      });
    }
    if (result.affectedRows) {
      return res.status(OK_AND_COMPLETED).json({
        status: true,
        code: OK_AND_COMPLETED,
        message: "Customer details updated successfully",
        errors: [],
      });
    } else {
      return res.json({
        status: false,
        code: BAD_REQUEST,
        message: "",
        errors: ["Invalid customer id"],
      });
    }
  });
};

const getAll = (search) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wca_users WHERE firstName LIKE '%${search}%'
  OR lastName LIKE '%${search}%'
  OR email LIKE '%${search}%'
  OR phone LIKE '%${search}%'`;
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.length);
    });
  });
};

const getCustomerList = async (req, res) => {
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

    const sql = `SELECT customer_id,firstName,lastName,
    phone,email,DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p')
    AS created_on,vehicles FROM wca_users WHERE firstName LIKE '%${search}%'
OR lastName LIKE '%${search}%'
OR email LIKE '%${search}%'
OR phone LIKE '%${search}%'
ORDER BY ${sortColumn} ${sort}
LIMIT ${skip},${limit}`;
    await pool.query(sql, (err, result) => {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          status: false,
          code: INTERNAL_SERVER_ERROR,
          message: "",
          errors: ["Unable to fetch Customer List"],
        });
      }
      if (result.length) {
        return res.json({
          status: true,
          code: OK_AND_COMPLETED,
          message: "Customer List found successfully",
          customer_list: result,
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
          customer_list: result,
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
      errors: ["Unable to fetch Customer List"],
    });
  }
};
const getCustomerById = async (req, res) => {
  if (req.body.customer_id) {
    await pool.query(
      `select customer_id,firstName,lastName,phone,email,address from wca_users where customer_id = ?`,
      [req.body.customer_id],
      (error, results, fields) => {
        if (error) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            code: INTERNAL_SERVER_ERROR,
            message: "",
            errors: ["Unable to fetch Customer details"],
          });
        }
        if (results.length) {
          return res.status(OK_AND_COMPLETED).json({
            status: true,
            code: OK_AND_COMPLETED,
            message: "Customer details found successfully",
            data: results[0],
            errors: [],
          });
        } else {
          return res.json({
            status: false,
            code: BAD_REQUEST,
            message: "",
            errors: ["Invalid customer id"],
          });
        }
      }
    );
  } else {
    return res.json({
      status: false,
      code: BAD_REQUEST,
      message: "",
      errors: ["Invalid customer id"],
    });
  }
};
const deleteCustomerById = async (req, res) => {
  if (req.body.customer_id) {
    await pool.query(
      `DELETE  from wca_users where customer_id = ?`,
      [req.body.customer_id],
      (error, results, fields) => {
        if (error) {
          return res.status(INTERNAL_SERVER_ERROR).json({
            status: false,
            code: INTERNAL_SERVER_ERROR,
            message: "",
            errors: ["Unable to remove customer record"],
          });
        }
        if (results.affectedRows) {
          return res.json({
            status: true,
            code: OK,
            message: "Customer record removed successfully",
            errors: [],
          });
        } else {
          return res.json({
            status: false,
            code: OK_WITH_CONFLICT,
            message: "",
            errors: ["Customer record does not exist"],
          });
        }
      }
    );
  } else {
    return res.json({
      status: false,
      code: BAD_REQUEST,
      message: "",
      errors: ["Invalid customer id"],
    });
  }
};
module.exports = {
  creatingCustomer,
  getCustomerList,
  getCustomerById,
  updateCustomer,
  deleteCustomerById,
};
