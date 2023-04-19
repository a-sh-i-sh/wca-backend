// Array of vin listing DATA storing in database new table here
const pool = require("../../connection/db");
const { INTERNAL_SERVER_ERROR } = require("../../config/const")
const { marketcheck_vehicle_info, marketcheck_vehicle_dealer_info } = require("../../config/constTablesStruct")
const { send_response, send_sqlError } = require("../../config/reponseObject")

const SearchCarsData = async (data) => {
    try{
// cron jobs run and inside its function we can update our database table on every job
 
let keys = Object.keys(marketcheck_vehicle_info).slice(2,Object.keys(marketcheck_vehicle_info).length)
let values = Object.values(data).slice(0,Object.values(data)?.length - 3);
let sql = `INSERT INTO ${marketcheck_vehicle_info?.tablename} (${keys}) VALUES (${values})`;
 await pool.query(sql, (err,result) => {
    if(err){
       return send_sqlError(res)
    }
 })



 keys = Object.keys(marketcheck_vehicle_dealer_info).slice(2,Object.keys(marketcheck_vehicle_dealer_info).length);



 
    }catch(err){
        const obj = {
            res,
            status: false,
            code: INTERNAL_SERVER_ERROR,
            errors: ["Unable to update cars data from marketcheck"]
        }
        send_response(obj)
    }
}
module.exports = {SearchCarsData}