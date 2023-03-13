require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../connection/db");
const {staffValidation} = require("../../validators/staff")

const creatingStaff = async (req,res) => {
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

}

const getStaffList = async (req,res) => {
    console.log("body",req.body);
   const sql = `SELECT * FROM wca_staff`;
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
    });
  });

}

module.exports = {creatingStaff, getStaffList}