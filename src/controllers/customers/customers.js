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
const { send_sqlError, send_response } = require("../../config/reponseObject");
const {
  DecryptedData,
  EncryptedData,
} = require("../../config/encrypt_decrypt");

const creatingCustomer = async (req, res, next) => {
  delete req.body.confirm_password;
  delete req.body.user_type;

  if (req.body.customer_id === "") {
    delete req.body.customer_id; // delete id before storing in database
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    try {
      const createdOn = new Date();
      Object.assign(req.body, { createdOn });
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const sql = `INSERT INTO wca_users (${keys}) VALUES (?)`;

      await pool.query(sql, [values], (err, result) => {
        if (err) {
          return send_sqlError(res);
          // return res.status(INTERNAL_SERVER_ERROR).json({
          //   status: false,
          //   code: INTERNAL_SERVER_ERROR,
          //   message: "",
          //   errors: ["Unable to save customer details"],
          // });
        }
        if (result.affectedRows) {
          const obj = {
            res,
            status: true,
            code: CREATED,
            message: "Customer added successfully",
          };
          return send_response(obj);
        } else {
          const obj = {
            res,
            status: false,
            code: PROMPT_CODE,
            errors: ["Unable to save customer details"],
          };
          return send_response(obj);
        }
      });
    } catch (error) {
      const obj = {
        res,
        status: false,
        code: INTERNAL_SERVER_ERROR,
        errors: ["Unable to save customer details"],
      };
      return send_response(obj);
    }
  } else {
    next();
  }
};

const updateCustomer = async (req, res) => {
  delete req.body.confirm_password;
  delete req.body.user_type;
  console.log("req.body", req.body);

  try {
    if (req.body.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;

      if (req.body.createdOn !== undefined) {
        const created_on = new Date();
        var sql = `update wca_users set firstName=?,lastName=?,phone=?,email=?,address=?,password=?,createdOn=?,is_deleted=? where customer_id = ?`;
        var sqlValues = [
          req.body.firstName,
          req.body.lastName,
          req.body.phone,
          req.body.email,
          req.body.address,
          req.body.password,
          created_on,
          0,
          req.body.customer_id,
        ];
      } else {
        sql = `update wca_users set firstName=?,lastName=?,phone=?,email=?,address=?,password=? where customer_id = ?`;
        sqlValues = [
          req.body.firstName,
          req.body.lastName,
          req.body.phone,
          req.body.email,
          req.body.address,
          req.body.password,
          req.body.customer_id,
        ];
      }
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
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to update customer details"],
        // });
      }
      if (result.affectedRows) {
        const obj = {
          res,
          status: true,
          code: req.body.createdOn !== undefined ? CREATED : OK_AND_COMPLETED,
          message:
            req.body.createdOn !== undefined
              ? "Customer added successfully"
              : "Customer details updated successfully",
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors: ["Unable to update the customer details"],
        };
        return send_response(obj);
      }
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to update the customer details"],
    };
    return send_response(obj);
  }
};

const getAll = (search) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wca_users WHERE is_deleted = 0 
  AND ( firstName LIKE '%${search}%'
  OR lastName LIKE '%${search}%'
  OR email LIKE '%${search}%'
  OR phone LIKE '%${search}%'
  OR vehicles LIKE '%${search}%'
  OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%') `;
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
    AS created_on,vehicles FROM wca_users WHERE  is_deleted = 0 
AND ( firstName LIKE '%${search}%'
OR lastName LIKE '%${search}%'
OR email LIKE '%${search}%'
OR phone LIKE '%${search}%'
OR vehicles LIKE '%${search}%'
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
        //   errors: ["Unable to fetch Customer List"],
        // });
      }
      if (result.length) {
        result.map((item, index) => {
          item.customer_id = EncryptedData(item.customer_id);
        });
      }

      const obj = {
        res,
        status: true,
        code: OK_AND_COMPLETED,
        message: result?.length
          ? "Customer List found successfully"
          : "No record found",
        data: {
          customer_list: result,
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
      errors: ["Unable to fetch Customer List"],
    };
    return send_response(obj);
  }
};

const getCustomerById = async (req, res) => {
  try {
    await pool.query(
      `select customer_id,firstName,lastName,phone,email,address from wca_users where customer_id = ?`,
      [req.body.customer_id],
      (error, results, fields) => {
        if (error) {
          return send_sqlError(res);
          // return res.status(INTERNAL_SERVER_ERROR).json({
          //   status: false,
          //   code: INTERNAL_SERVER_ERROR,
          //   message: "",
          //   errors: ["Unable to fetch Customer details"],
          // });
        }
        if (results.length) {
          results[0].customer_id = EncryptedData(results[0].customer_id);
        }

        const obj = {
          res,
          status: true,
          code: OK_AND_COMPLETED,
          message: results?.length
            ? "Customer details found successfully"
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
      errors: ["Unable to fetch customer details"],
    };
    return send_response(obj);
  }
};

const deleteCustomerById = async (req, res) => {
  try {
    await pool.query(
      `update wca_users set is_deleted=? where customer_id = ?`,
      [1, req.body.customer_id],
      (error, results, fields) => {
        if (error) {
          return send_sqlError(res);
          // return res.status(INTERNAL_SERVER_ERROR).json({
          //   status: false,
          //   code: INTERNAL_SERVER_ERROR,
          //   message: "",
          //   errors: ["Unable to remove customer record"],
          // });
        }
        if (results.affectedRows) {
          const obj = {
            res,
            status: true,
            code: OK,
            message: "Customer record removed successfully",
          };
          return send_response(obj);
        } else {
          const obj = {
            res,
            status: false,
            code: BAD_REQUEST,
            errors: ["Customer record does not exist"],
          };
          return send_response(obj);
        }
      }
    );
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to remove customer"],
    };
    return send_response(obj);
  }
};

module.exports = {
  creatingCustomer,
  getCustomerList,
  getCustomerById,
  updateCustomer,
  deleteCustomerById,
};
