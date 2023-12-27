// 1) First of all, check the data of marketcheck is updatable or not otherwise use cron job.
// 2) Apply different check for used or new car
// 3) For Array list use loop inside this data will assign then
// 4) A query for searching Vin number, exiting or not, will execute.
// 5) Based on existance of vin, data of marketcheck will update or insert.

const pool = require("../../connection/db");
const { marketcheck_vehicle_info, marketcheck_vehicle_media_info } = require("../../config/constTablesStruct");
const { InsertSearchCarsData } = require("../../controllers/MarketCheck/InsertSearchByCondition");
const { UpdateSearchCarsData } = require("../../controllers/MarketCheck/UpdateSearchBycondition");
const SearchByCondition = require("./SearchByCondition");
const { send_sqlError } = require("../../config/reponseObject");

const CheckVin_Insert_Update = async (vin) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ${marketcheck_vehicle_info?.id},${marketcheck_vehicle_info?.vin} FROM ${marketcheck_vehicle_media_info?.tablename} WHERE vin = ?`;
    pool.query(sql, [vin], (err, result) => {
      if (err) {
        console.log("vehicle market build DATA", err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const isUpdated = async (req, res, next) => {
  try {
    //   const todayDate = new Date();
    //   if (todayDate - updatedDate > 24 * 60 * 60 * 1000) {

    let car_type = "used";
    let include_relevant_links = "true";
    let start = 0;
    let rows = 50;
    let APIDATA = await SearchByCondition(
      car_type,
      include_relevant_links,
      start,
      rows
    );


        for(let index = 0; index < APIDATA?.listings?.length; index++) {
          const result = APIDATA?.listings[index];
        let data = {
          vin: result?.vin ? result?.vin : "",
          vehicle_id: result?.id ? result?.id : "",
          heading: result?.heading ? result?.heading : "",
          miles: result?.miles ? result?.miles : 0,
          trade_price: result?.price ? result?.price : 0.00,
          target_retail: result?.msrp ? result?.msrp : 0.00,
          ext_color: result?.exterior_color ? result?.exterior_color : "",
          int_color: result?.interior_color ? result?.interior_color : "",
          base_ext_color: result?.base_ext_color ? result?.base_ext_color : "",
          base_int_color: result?.base_int_color ? result?.base_int_color : "",
          dom: result?.dom ? result?.dom : "",
          seller_type: result?.seller_type ? result?.seller_type : "",
          media: result?.media ? result?.media : "",
          dealer: {
            vin: result?.vin ? result?.vin : "",
            dealer_id: result?.dealer?.id ? result?.dealer?.id : "",
            name: result?.dealer?.name ? result?.dealer?.name : "",
            city: result?.dealer?.city ? result?.dealer?.city : "",
            state: result?.dealer?.state ? result?.dealer?.state : "",
            country: result?.dealer?.country ? result?.dealer?.country : "",
            zip: result?.dealer?.zip ? result?.dealer?.zip : "",
            phone: result?.dealer?.phone ? result?.dealer?.phone : "",
            seller_email: result?.dealer?.seller_email ? result?.dealer?.seller_email : "",
          },
          build: {
            vin: result?.vin ? result?.vin : "",
            year: result?.build?.year ? result?.build?.year : "",
            make: result?.build?.make ? result?.build?.make : "",
            model: result?.build?.model ? result?.build?.model : "",
            fuel_type: result?.build?.fuel_type ? result?.build?.fuel_type : "",
            doors: result?.build?.doors ? result?.build?.doors : 0,
            cylinders: result?.build?.cylinders ? result?.build?.cylinders : 0,
            engine: result?.build?.engine ? result?.build?.engine : "",
            transmission: result?.build?.transmission ? result?.build?.transmission : "",
            trim: result?.build?.trim ? result?.build?.trim : "",
            body_type: result?.build?.body_type ? result?.build?.body_type : "",
            drivetrain: result?.build?.drivetrain ? result?.build?.drivetrain : "",
            std_seating: result?.build?.std_seating ? result?.build?.std_seating : "",
            highway_mpg: result?.build?.highway_mpg ? result?.build?.highway_mpg : "",
            city_mpg: result?.build?.city_mpg ? result?.build?.city_mpg : "",
          },
        };

        const existVin = await CheckVin_Insert_Update(result?.vin);
        console.log("End of check exiting vin")
        if (existVin.length === 0) {
          console.log("going to insert")
          await InsertSearchCarsData(req, res, data);
        } else {
          console.log("going to update")
          await UpdateSearchCarsData(req, res, data);
        }
      }
    console.log("end of complete insertion/updation")
    next();
    //   } else {
    //     next();
    //   }
  } catch (err) {
    console.log("isUPdated page", err);
    return send_sqlError(res)
  }
};

module.exports = isUpdated;
