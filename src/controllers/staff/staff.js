require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../connection/db");
const { staffValidation } = require("../../validators/staff");

const creatingStaff = async (req, res) => {
  delete req.body.confirm_password;
  // Validate staff form data
  const { error } = staffValidation(req.body);
  if (error) {
    return res
      .status(422)
      .send({ status: false, message: error.details[0].message });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;

  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const sql = `INSERT INTO wca_staff (${keys}) VALUES (?)`;
    await pool.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: false,
          message: "Unable to add as a staff member",
          // errors: err.sqlMessage
        });
      }
      console.log("record inserted", result);
      return res.status(201).json({
        status: true,
        message: "Staff member added successfully",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Unable to add as a staff member",
    });
  }
};

const getAll = new Promise((resolve, reject) => {
  const sql = `SELECT * FROM wca_staff`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      reject(err);
    }
    // console.log("user",result.length)
    resolve(result.length);
  });
});

const getStaffList = async (req, res) => {
  try {
    console.log("body", req.body);
    const page = req.body.page ? Number(req.body.page) : 1;
    const limit = req.body.limit ? Number(req.body.limit) : 5;
    const skip = (page - 1) * limit;
    const sort = req.body.sort;
    const search = req.body.search;

    const total_records = await getAll;
    const pages =
      total_records % limit === 0
        ? Math.trunc(total_records / limit)
        : Math.trunc(total_records / limit) + 1;

    const sql = `SELECT * FROM wca_staff WHERE firstName LIKE '%${search}%'
OR lastName LIKE '%${search}%'
OR email LIKE '%${search}%'
OR type LIKE '%${search}%'
OR phone LIKE '%${search}%'
LIMIT ${skip},${limit}`;
    await pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: false,
          message: "Unable to fetch Staff List",
          // errors: err.sqlMessage
        });
      }
      console.log("record found", result);
      return res.status(201).json({
        status: true,
        message: "Staff List found successfully",
        staff_list: result,
        page,
        pages,
        page_records: result.length,
        total_records,
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to fetch Staff List" });
  }
};

module.exports = { creatingStaff, getStaffList };
