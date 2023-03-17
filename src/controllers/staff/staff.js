require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../../connection/db");
const uuid = require("uuid");

const creatingStaff = async (req, res, next) => {
  delete req.body.confirm_password;

  if (req.body.staff_id === "") {
    console.log("Ram hellow ")
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
          console.log(err);
          return res.status(500).json({
            status: false,
            message: "Unable to add as a staff member",
            // errors: err.sqlMessage
          });
        }
        if(result.affectedRows){
        return res.status(201).json({
          status: true,
          message: "Staff member added successfully",
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "Unable to add as a staff member",
        });
      }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Unable to add as a staff member",
      });
    }
  } else {
    next()
  }
};


const updateStaff = async (req,res) => {
  delete req.body.confirm_password;
  console.log("body",req.body)
  if (req.body.password) {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    var sql = `update wca_staff set firstName=?,lastName=?,phone=?,email=?,type=?,password=? where staff_id = ?`;
    var sqlValues = [req.body.firstName,req.body.lastName,req.body.phone,req.body.email,req.body.type,req.body.password,req.body.staff_id]
  } else {
    sql = `update wca_staff set firstName=?,lastName=?,phone=?,email=?,type=? where staff_id = ?`;
    sqlValues = [req.body.firstName,req.body.lastName,req.body.phone,req.body.email,req.body.type,req.body.staff_id]
  }
  console.log("sql",sql)
  console.log("sqlValues",sqlValues)

  await pool.query(sql, sqlValues, async (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Unable to update staff member's details",
          errors: [err],
        });
      }
      if(result.affectedRows){
      return res.status(200).json({
        status: true,
        message: "Staff member updated successfully",
        errors: []
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Unable to update staff member's details",
        errors: ["Invalid staff id"]
      });
    }
    });
}

const getAll = (search) => {
  return new Promise((resolve, reject) => {
  const sql = `SELECT * FROM wca_staff WHERE firstName LIKE '%${search}%'
  OR lastName LIKE '%${search}%'
  OR email LIKE '%${search}%'
  OR type LIKE '%${search}%'
  OR phone LIKE '%${search}%'`;
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
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

    const total_records = await getAll(search);
    const pages =
    total_records % limit === 0
      ? Math.trunc(total_records / limit)
      : Math.trunc(total_records / limit) + 1;

    const sql = `SELECT * FROM wca_staff WHERE firstName LIKE '%${search}%'
OR lastName LIKE '%${search}%'
OR email LIKE '%${search}%'
OR type LIKE '%${search}%'
OR phone LIKE '%${search}%'
ORDER BY ${sortColumn} ${sort}
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
      if(result.length){
      return res.status(201).json({
        status: true,
        message: "Staff List found successfully",
        staff_list: result,
        page,
        pages,
        page_records: result.length,
        total_records,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "No record found",
        staff_list: result,
        page,
        pages,
        page_records: result.length,
        total_records,
      });
    }
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to fetch Staff List" });
  }
};
const getStaffById = async (req, res) => {
  if(req.body.staff_id){
  await pool.query(
    `select staff_id,firstName,lastName,phone,email,type from wca_staff where staff_id = ?`,
    [req.body.staff_id],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "Unable to fetch Staff member details",
          data: error,
        });
      }
      if(results.length){
      return res.status(200).json({
        status: true,
        message: "Staff member details fetch successfully",
        data: results[0],
      });
    }else{
      return res.status(400).json({
        status: false,
        message: "Invalid staff id",
      });
    }
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Invalid staff id",
    });
  }
};
const deleteStaffById = async (req, res) => {
  if(req.body.staff_id){
  await pool.query(
    `DELETE  from wca_staff where staff_id = ?`,
    [req.body.staff_id],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({
          status: false,
          message: "Unable to removed Staff member",
          data: error,
        });
      }
      if(results.affectedRows){
      return res.status(200).json({
        status: true,
        message: "Staff member removed Successfully",
      });
    }else{
      return res.status(400).json({
        status: false,
        message: "Invalid staff id",
      });
    }
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Invalid staff id",
    });
  }
};
module.exports = { creatingStaff, getStaffList, getStaffById, updateStaff, deleteStaffById };
