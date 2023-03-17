const bcrypt = require("bcrypt");
const pool = require("../../connection/db");
const uuid = require("uuid");
const { registerValidation } = require("../../validators/auth");
const result = uuid.v4();

const getProfile = async (req, res) => {
  const sql = `select id,firstName,lastName,phone,email from wca_users`;
  await pool.query(sql, (error, results, fields) => {
    if (error) {
      return res.status(500).json({
        status: false,
        message: "Unable to fetch profile data",
        errors: [error],
      });
    }
    if (results.length) {
      return res.status(200).json({
        status: true,
        message: "successfully found profile data",
        data: results[0],
        errors: [],
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No record found",
        data: results[0],
        errors: [],
      });
    }
  });
};
const updateUser = async (req, res) => {
  if (req.body.id) {
    if(req.body.password){
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    var sql = "update wca_users set firstName=?, lastName=?, phone=?, email=?, password=? where id = ?";
    var sqlValues = [req.body.firstName,req.body.lastName,req.body.phone,req.body.email,req.body.password,req.body.id]
    } else {
       sql = "update wca_users set firstName=?, lastName=?, phone=?, email=? where id = ?"
       sqlValues = [req.body.firstName,req.body.lastName,req.body.phone,req.body.email,req.body.id]
    }
    console.log("sql",sql)
    console.log("sqlValues",sqlValues)

    await pool.query(sql, sqlValues, async (err, result) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Unable to update profile",
            errors: [err],
      });
        }
        console.log("if id is wrong don't match",result);
        if (result.affectedRows) {
          return res.status(200).json({
            status: true,
            message: "profile updated successfully",
            errors: ["Updated Successfully"],
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "Unable to update profile",
            errors: ["Invalid Id"],
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      status: false,
      message: "Unable to update profile",
      errors: ["Invalid Id"],
    });
  }
};

module.exports = { getProfile, updateUser };
