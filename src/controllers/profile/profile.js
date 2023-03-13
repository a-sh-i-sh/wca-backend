const pool = require('../../connection/db')
const uuid = require('uuid')
const result = uuid.v4()

const getProfile = (req, res) => {
    pool.query(
        `select id,firstName,lastName,phone,email from wca_info`,
        [],
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
   const updateUser =  async (req, res)  => {
    
    const sql = "update wca_info set firstName=?, lastName=?, phone=?, email=?, password=? where id = ?";
    await pool.query(sql, [
      req.body.first_name,
      req.body.last_name,
      req.body.phone,
      req.body.email,
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
    // pool.query(
    //   `update registration set firstName=?, lastName=?, phone=?, email=?, password=? where email = ?`,
    //   [
    //     data.first_name,
    //     data.last_name,
    //     data.phone,
    //     data.email,
    //     data.password,
    //   ],
    //   (error, results, fields) => {
    //     if (error) {
    //       return res.json({
    //         status: false,
    //         data: error
    //       });
    //     }
    //     return res.json({
    //       status: true,
    //       data: results[0]
    //     });
    //   }
    // );
  // }
module.exports = { getProfile ,updateUser};
