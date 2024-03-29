const { INTERNAL_SERVER_ERROR } = require("../../config/const");
const {
  marketcheck_vehicle_info,
  marketcheck_vehicle_dealer_info,
  marketcheck_vehicle_build_info,
  marketcheck_vehicle_media_info,
} = require("../../config/constTablesStruct");
const { send_response, send_sqlError } = require("../../config/reponseObject");
const pool = require("../../connection/db");

const QueryForUpdate = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, result) => {
     if (err) {
       console.log("update vdi page", err);
       reject(err)
     }
     console.log("2 rsult",result);
     resolve(result)
   });
 })
}

const UpdateSearchCarsData = async (req, res, data) => {
  // try {
    // const mediaData = Object.values(data)[Object.values(data)?.length - 3];
    const dealerData = Object.values(data)[Object.values(data)?.length - 2];
    const buildData = Object.values(data)[Object.values(data)?.length - 1];

    // let keys = Object.keys(marketcheck_vehicle_info).slice(
    //   3,
    //   Object.keys(marketcheck_vehicle_info).length
    // );
    // let values = Object.values(data).slice(1, Object.values(data)?.length - 3);
    // keys = keys.map((key, ind) => {
    //   return (key += ` = ?`);
    // });

    // // Combine the keys and values into the query string
    // let sql = `UPDATE ${marketcheck_vehicle_info?.tablename} SET ${keys} WHERE vin = '${data?.vin}'`;
    // let p1 = await QueryForUpdate(sql,values);




    // keys = Object.keys(marketcheck_vehicle_dealer_info).slice(
    //   3,
    //   Object.keys(marketcheck_vehicle_dealer_info).length
    // );
    // keys = keys.map((key, ind) => {
    //   return (key += ` = ?`);
    // });
    // values = Object.values(dealerData).slice(1, Object.values(dealerData)?.length);

    // sql = `UPDATE ${marketcheck_vehicle_dealer_info?.tablename} SET ${keys} WHERE vin = '${data?.vin}'`;
    //  let p2 = await QueryForUpdate(sql, values);
      




    // keys = Object.keys(marketcheck_vehicle_build_info).slice(
    //   3,
    //   Object.keys(marketcheck_vehicle_build_info).length
    // );
    // keys = keys.map((key, ind) => {
    //   return (key += ` = ?`);
    // });
    // values = Object.values(buildData).slice(1, Object.values(buildData)?.length);

    // sql = `UPDATE ${marketcheck_vehicle_build_info?.tablename} SET ${keys} WHERE vin = '${data?.vin}'`;
    // let p3 = await QueryForUpdate(sql,values);



    console.log("hello 48.....................");


      let img = (data?.media?.photo_links?.length > 3) ? 3 : data?.media?.photo_links?.length;

      for (let index = 0; index < img; index++) {
        const item = data?.media?.photo_links[index];
      let mediaValues = [encodeURIComponent(item), data?.vin];
      sql = `UPDATE ${marketcheck_vehicle_media_info?.tablename} SET photo_link=?,type=1  WHERE vin=?`;
      console.log("ram index: ", index);
      await QueryForUpdate(sql, mediaValues);     
      console.log("end of photo links")
    }

      img = (data?.media?.photo_links_cached?.length > 3) ? 3 : data?.media?.photo_links_cached?.length;
      
      for (let index = 0; index < img; index++) {
        const item = data?.media?.photo_links_cached[index];
      let cachedValues = [encodeURIComponent(item), data?.vin];
      sql = `UPDATE ${marketcheck_vehicle_media_info?.tablename} SET photo_link=?,type=2 WHERE vin=?`;
      console.log("cached index: ", index);
      await QueryForUpdate(sql, cachedValues);
      console.log("end of Cached links")
    }

    return;

  // } catch (err) {
  //   console.log("updatesearch ",err);
  //   const obj = {
  //     res,
  //     status: false,
  //     code: INTERNAL_SERVER_ERROR,
  //     errors: ["Unable to update cars data from marketcheck"],
  //   };
  //   return send_response(obj);
  // }
};
module.exports = { UpdateSearchCarsData };
