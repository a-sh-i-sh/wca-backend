const {
    create,
    getUsers,
    getUserByUserEmail
    // updateUser,
    // deleteUser
  } = require("./admin");
  const { hashSync, genSaltSync, compareSync } = require("bcrypt");
  const { sign } = require("jsonwebtoken");
  
  module.exports = {
    createUser: (req, res) => {
      const body = req.body;
      console.log(body);
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      body.confirm_password = hashSync(body.confirm_password, salt);
      create(body, (err, results) => {
        if (err) {
          console.log('//',err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror"
          });
        }
        return res.status(200).json({
          success: 1,
          data: results
        });
      });
    },
    login: (req, res) => {
      const body = req.body;
      getUserByUserEmail(body.email, (err, results) => {
        if (err) {
          console.log(err);
        }
        if (!results) {
          return res.json({
            status: false,
            data: "Invalid email or password"
          });
        }
        const result = compareSync(body.password, results.password);
        if (result) {
          results.password = undefined;
          const jsontoken = sign({ result: results }, "qwe1234", {
            expiresIn: "1h"
          });
          return res.json({
            status: true,
            message: "login successfully",
            token: jsontoken
          });
        } else {
          return res.json({
            status: false,
            data: "Invalid email or password"
          });
        }
      });
    },
    getProfile: (req, res) => {
      getUsers((err, results) => {
        if (err) {
          return res.json({
            status: false,
            data: err
          });
        }
        return res.json({
          status: true,
          data: results[0]
        });
      });
    },
  //   updateUsers: (req, res) => {
  //     const body = req.body;
  //     const salt = genSaltSync(10);
  //     body.password = hashSync(body.password, salt);
  //     updateUser(body, (err, results) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //       return res.json({
  //         success: 1,
  //         message: "updated successfully"
  //       });
  //     });
  //   },
  //   deleteUser: (req, res) => {
  //     const data = req.body;
  //     deleteUser(data, (err, results) => {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }
  //       if (!results) {
  //         return res.json({
  //           success: 0,
  //           message: "Record Not Found"
  //         });
  //       }
  //       return res.json({
  //         success: 1,
  //         message: "user deleted successfully"
  //       });
  //     });
  //   }
  };