const { INTERNAL_SERVER_ERROR } = require("../../config/const");
const {
  marketcheck_vehicle_info,
  marketcheck_vehicle_dealer_info,
  marketcheck_vehicle_build_info,
  marketcheck_vehicle_media_info,
} = require("../../config/constTablesStruct");
const { send_response, send_sqlError } = require("../../config/reponseObject");
const pool = require("../../connection/db");

const UpdateSearchCarsData = async (req, res, data) => {
  try {
    // const mediaData = Object.values(data)[Object.values(data)?.length - 3];
    const dealerData = Object.values(data)[Object.values(data)?.length - 2];
    const buildData = Object.values(data)[Object.values(data)?.length - 1];

    let keys = Object.keys(marketcheck_vehicle_info).slice(
      3,
      Object.keys(marketcheck_vehicle_info).length
    );
    let values = Object.values(data).slice(1, Object.values(data)?.length - 3);
    keys = keys.map((key, ind) => {
      return (key += ` = ?`);
    });

    // Combine the keys and values into the query string
    let sql = `UPDATE ${marketcheck_vehicle_info?.tablename} SET ${keys} WHERE vin = '${data?.vin}'`;

    await pool.query(sql, values, (err, result) => {
      if (err) {
        console.log("update vi page", err);
        return send_sqlError(res);
      }
      //   console.log("1 reslt",result)
    });

    keys = Object.keys(marketcheck_vehicle_dealer_info).slice(
      3,
      Object.keys(marketcheck_vehicle_dealer_info).length
    );
    keys = keys.map((key, ind) => {
      return (key += ` = ?`);
    });
    values = Object.values(dealerData).slice(1, Object.values(dealerData)?.length);

    sql = `UPDATE ${marketcheck_vehicle_dealer_info?.tablename} SET ${keys} WHERE vin = '${data?.vin}'`;

    await pool.query(sql, values, (err, result) => {
      if (err) {
        console.log("update vdi page", err);
        return send_sqlError(res);
      }
      // console.log("2 rsult",result);
    });

    keys = Object.keys(marketcheck_vehicle_build_info).slice(
      3,
      Object.keys(marketcheck_vehicle_build_info).length
    );
    keys = keys.map((key, ind) => {
      return (key += ` = ?`);
    });
    values = Object.values(buildData).slice(1, Object.values(buildData)?.length);

    sql = `UPDATE ${marketcheck_vehicle_build_info?.tablename} SET ${keys} WHERE vin = '${data?.vin}'`;

    await pool.query(sql, values, (err, result) => {
      if (err) {
        console.log("update vbi page", err);
        return send_sqlError(res);
      }
      // console.log("3 rsult",result);
    });

    console.log("hello.....................");
    // keys = ["vin", "photo_link", "type"].map(key => `${key} = ?`).join(",");
    data?.media?.photo_links?.map(async (item, index) => {
      let mediaValues = [encodeURIComponent(item), data?.vin];

      sql = `UPDATE ${marketcheck_vehicle_media_info?.tablename} SET photo_link=?,type=1  WHERE vin=?`;
      console.log("ram ", mediaValues);
      console.log("ram ", sql);
        pool.query(sql, mediaValues, async (err, result) => {
          if (err) {
            console.log("update vImage1 page", err);
            return send_sqlError(res);
          }
        })
      
    })

    data?.media?.photo_links_cached?.map(async (item, index) => {
      let cachedValues = [encodeURIComponent(item), data?.vin];
      
      sql = `UPDATE ${marketcheck_vehicle_media_info?.tablename} SET photo_link=?,type=2 WHERE vin=?`;
      console.log("iam ", cachedValues);
      console.log("iam ", sql);
        pool.query(sql, cachedValues, async (err, result) => {
          if (err) {
            console.log("update vImage2 page", err);
            return send_sqlError(res);
          }
        })
    })

    return;
  } catch (err) {
    console.log("updatesearch ",err);
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to update cars data from marketcheck"],
    };
    return send_response(obj);
  }
};
module.exports = { UpdateSearchCarsData };
