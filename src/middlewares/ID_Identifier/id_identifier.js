const {
  INTERNAL_SERVER_ERROR,
  INVALID_ID,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../../config/const");
const { DecryptedData } = require("../../config/encrypt_decrypt");
const { send_response, send_sqlError } = require("../../config/reponseObject");
const pool = require("../../connection/db");

const identifyID = async (req, res, next) => {
  const IDArray = ["staff_id", "customer_id", "vehicles_id"];
  const tableName = ["wca_staff", "wca_users", "wca_negotiating_vehicles"];
  let IDIndex = -1;

  for (let i = 0; i < IDArray.length; i++) {
    if (Object.hasOwn(req.body, IDArray[i])) {
      IDIndex = i;
      break;
    }
  }

  if (IDIndex === -1) {
    const obj = {
      res,
      status: false,
      code: NOT_FOUND,
      errors: ["Undefined Id, please send id in parameters"],
    };
    return send_response(obj);
  }
  if (req.body[IDArray[IDIndex]] === "") {
    return next();
  }

  // Decryption method call for decrypting id
  const decryptId = await DecryptedData(req.body[IDArray[IDIndex]]);
  if (decryptId?.code || decryptId?.reason) {
    const obj = {
      res,
      status: false,
      code: INVALID_ID,
      errors: [`Invalid ${IDArray[IDIndex]}`],
    };
    return send_response(obj);
  }

  const sql = `select * from ${tableName[IDIndex]} where ${IDArray[IDIndex]}=?`;
  const sqlValues = [decryptId];

  await pool.query(sql, sqlValues, (err, result) => {
    if (err) {
      return send_sqlError(res);
    } else if (result.length) {
      
      if (result.length === 1 && result[0].is_deleted === 0) {
        req.body[IDArray[IDIndex]] = decryptId;
        return next();
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors:
            result.length === 1 && result[0].is_deleted === 1
              ? ["Your id is already deleted"]
              : ["Only one id allowed, not more than"],
        };
        return send_response(obj);
      }

    } else {
      const obj = {
        res,
        status: false,
        code: INVALID_ID,
        errors: [`Invalid ${IDArray[IDIndex]}`],
      };
      return send_response(obj);
    }
  });
};

module.exports = identifyID;
