const pool = require("../../connection/db");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into wca_info(firstName, lastName, phone, email, password, confirm_password) 
                values(?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.phone,
        data.email,
        data.password,
        data.confirm_password
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from wca_info where email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  getUsers: callBack => {
    pool.query(
      `select firstName,lastName,phone,email from wca_info`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  // updateUser: (data, callBack) => {
  //   pool.query(
  //     `update registration set firstName=?, lastName=?, gender=?, email=?, password=?, number=? where id = ?`,
  //     [
  //       data.first_name,
  //       data.last_name,
  //       data.gender,
  //       data.email,
  //       data.password,
  //       data.number,
  //       data.id
  //     ],
  //     (error, results, fields) => {
  //       if (error) {
  //         callBack(error);
  //       }
  //       return callBack(null, results[0]);
  //     }
  //   );
  // },
  // deleteUser: (data, callBack) => {
  //   pool.query(
  //     `delete from registration where id = ?`,
  //     [data.id],
  //     (error, results, fields) => {
  //       if (error) {
  //         callBack(error);
  //       }
  //       return callBack(null, results[0]);
  //     }
  //   );
  // }
};