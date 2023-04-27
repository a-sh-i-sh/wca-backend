// Array of vin listing DATA storing in database new table here
const pool = require("../../connection/db");
const { INTERNAL_SERVER_ERROR } = require("../../config/const");
const {
  marketcheck_vehicle_info,
  marketcheck_vehicle_dealer_info,
  marketcheck_vehicle_build_info,
  marketcheck_vehicle_media_info,
} = require("../../config/constTablesStruct");
const { send_response, send_sqlError } = require("../../config/reponseObject");

const InsertSearchCarsData = async (req, res, data) => {
  try {
    // const mediaData = Object.values(data)[Object.values(data)?.length - 3];
    const dealerData = Object.values(data)[Object.values(data)?.length - 2];
    const buildData = Object.values(data)[Object.values(data)?.length - 1];
    

    let keys = Object.keys(marketcheck_vehicle_info).slice(
      2,
      Object.keys(marketcheck_vehicle_info).length
    );
    let values = Object.values(data).slice(0, Object.values(data)?.length - 3);

    // Sanitize the input values to prevent SQL injection attacks
    let sanitizedValues = values.map((val) =>
      typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
    );

    // Combine the keys and values into the query string
    let sql = `INSERT INTO ${marketcheck_vehicle_info?.tablename} (${keys.map(
      (key) => `\`${key}\``
    )}) VALUES (${sanitizedValues})`;

    await pool.query(sql, (err, result) => {
      if (err) {
        console.log("listsearch vi page", err);
        return send_sqlError(res);
      }
    })

    keys = Object.keys(marketcheck_vehicle_dealer_info).slice(
      2,
      Object.keys(marketcheck_vehicle_dealer_info).length
    );
    values = Object.values(dealerData);

    // Sanitize the input values to prevent SQL injection attacks
    sanitizedValues = values.map((val) =>
      typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
    );

    sql = `INSERT INTO ${marketcheck_vehicle_dealer_info?.tablename} 
    (${keys.map((key) => `\`${key}\``)}) VALUES (${sanitizedValues})`;

    await pool.query(sql, (err, result) => {
      if (err) {
        console.log("listsearch vdi page", err);
        return send_sqlError(res);
      }
    })

    keys = Object.keys(marketcheck_vehicle_build_info).slice(
      2,
      Object.keys(marketcheck_vehicle_build_info).length
    );
    values = Object.values(buildData);
    // Sanitize the input values to prevent SQL injection attacks
    sanitizedValues = values.map((val) =>
      typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
    );

    sql = `INSERT INTO ${marketcheck_vehicle_build_info?.tablename} (${keys.map(
      (key) => `\`${key}\``
    )}) VALUES (${sanitizedValues})`;

    await pool.query(sql, (err, result) => {
      if (err) {
        console.log("listsearch vbi page", err);
        return send_sqlError(res);
      }
    })

    keys = ["vin", "photo_link", "type"].join(",");
    data?.media?.photo_links?.map(async (item, index) => {
      values = [data?.vin, encodeURIComponent(item), 1]
        .map((val) => (typeof val === "string" ? `'${val}'` : val))
        .join(",");
      sql = `INSERT INTO ${marketcheck_vehicle_media_info?.tablename} (${keys}) VALUES (${values})`;
      await pool.query(sql, (err, result) => {
        if (err) {
          console.log("listsearch vImage1 page", err);
          return send_sqlError(res);
        }
      })
    });

    data?.media?.photo_links_cached?.map(async (item, index) => {
      values = [data?.vin, encodeURIComponent(item), 2]
        .map((val) => (typeof val === "string" ? `'${val}'` : val))
        .join(",");
      sql = `INSERT INTO ${marketcheck_vehicle_media_info?.tablename} (${keys}) VALUES (${values})`;
      await pool.query(sql, (err, result) => {
        if (err) {
          console.log("listsearch vImage2 page", err);
          return send_sqlError(res);
        }
      })
    });

    return;
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to update cars data from marketcheck"],
    };
    return send_response(obj);
  }
};
module.exports = { InsertSearchCarsData };
