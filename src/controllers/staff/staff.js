require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../connection/db");
const { staffValidation } = require("../../validators/staff")
const uuid = require('uuid')

const creatingStaff = async (req, res) => {
  delete req.body.confirm_password;
  // Validate staff form data
  const { error } = staffValidation(req.body);
  if (error) {
    return res
      .status(422)
      .send({ status: false, message: error.details[0].message });
  }

  if (req.body.id !== "") {
    if (req.body.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;
    }
    const sql = "update wca_staff set firstName=?, lastName=?, phone=?, email=?, type=?, password=? where id = ?";
    await pool.query(sql, [
      req.body.first_name,
      req.body.last_name,
      req.body.phone,
      req.body.email,
      req.body.type,
      req.body.password,
      req.body.id
    ], async (err, result) => {
      if (err) {
        return res.json({
          status: false,
          data: err
        });
      }
      return res.json({
        status: true,
        data: result
      });
    })
  }
  else {
    const id = uuid.v4()
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;
    try {
      Object.assign(req.body, { id: id })
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
  }
}

const getStaffList = async (req, res) => {
  console.log("body", req.body);
  const sql = `SELECT * FROM wca_staff`;
  await pool.query(sql, (err, result) => {
    if (err) {
      console.log(err);
                reject(err);
    }
    // console.log("user",result.length)
    resolve(result.length);
  });
}

const getStaffById = (req, res) => {
  pool.query(
    `select id,firstName,lastName,phone,email,type from wca_staff where id = ?`,
    [req.body.id],
    (error, results, fields) => {
      if (error) {
        return res.json({
          status: false,
          data: error
        });
      }
      return res.json({
        status: true,
        data: results[0]
      });
    }
  );
}
const deleteStaffById = (req, res) => {
  pool.query(
    `DELETE  from wca_staff where id = ?`,
    [req.body.id],
    (error, results, fields) => {
      if (error) {
        return res.status(400).json({
          status: false,
          data: error
        });
      }
      return res.status(200).json({
        status: true,
        message: "Staff removed Successfully"
      });
    }
  );
}
module.exports = { creatingStaff, getStaffList,getStaffById,deleteStaffById }
