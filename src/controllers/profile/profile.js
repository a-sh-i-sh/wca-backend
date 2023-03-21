const bcrypt = require("bcrypt");
const pool = require("../../connection/db");
const uuid = require("uuid");
const { registerValidation } = require("../../validators/auth");
const {
  INTERNAL_SERVER_ERROR,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../../config/const");
const result = uuid.v4();

const getProfile = async (req, res) => {
  const sql = `select id,firstName,lastName,phone,email from wca_users`;
  await pool.query(sql, (error, results, fields) => {
    if (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: false,
        code: INTERNAL_SERVER_ERROR,
        message: "",
        errors: ["Unable to fetch profile data"],
      });
    }
    if (results.length) {
      return res.json({
        status: true,
        code: OK,
        message: "successfully found profile data",
        errors: [],
      });
    } else {
      return res.json({
        status: false,
        code: NOT_FOUND,
        message: "",
        errors: ["No record found"],
      });
    }
  });
};
const updateUser = async (req, res) => {
  if (req.body.id) {
    if (req.body.password) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;

      var sql =
        "update wca_users set firstName=?, lastName=?, phone=?, email=?, password=? where id = ?";
      var sqlValues = [
        req.body.firstName,
        req.body.lastName,
        req.body.phone,
        req.body.email,
        req.body.password,
        req.body.id,
      ];
    } else {
      sql =
        "update wca_users set firstName=?, lastName=?, phone=?, email=? where id = ?";
      sqlValues = [
        req.body.firstName,
        req.body.lastName,
        req.body.phone,
        req.body.email,
        req.body.id,
      ];
    }

    await pool.query(sql, sqlValues, async (err, result) => {
      if (err) {
        return res.status(INTERNAL_SERVER_ERROR).json({
          status: false,
          code: INTERNAL_SERVER_ERROR,
          message: "",
          errors: ["Unable to update profile"],
        });
      }

      if (result.affectedRows) {
        return res.json({
          status: true,
          code: OK,
          message: "profile updated successfully",
          errors: [],
        });
      } else {
        return res.json({
          status: false,
          code: BAD_REQUEST,
          message: "",
          errors: ["Invalid Id"],
        });
      }
    });
  } else {
    return res.json({
      status: false,
      code: BAD_REQUEST,
      message: "",
      errors: ["Invalid Id"],
    });
  }
};

module.exports = { getProfile, updateUser };
