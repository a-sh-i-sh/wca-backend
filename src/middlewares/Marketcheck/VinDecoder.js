const axios = require("axios");
const { NOT_FOUND } = require("../../config/const");
const { send_response, send_sqlError } = require("../../config/reponseObject");
const { marketcheck_vehicle_build_info } = require("../../config/constTablesStruct");
const pool = require("../../connection/db");

const InsertBuildData = async (res, buildData) => {
    return new Promise((resolve, reject) => {
    let keys = Object.keys(marketcheck_vehicle_build_info).slice(
        2,
        Object.keys(marketcheck_vehicle_build_info).length
      );
    let values = Object.values(buildData);
      // Sanitize the input values to prevent SQL injection attacks
    let sanitizedValues = values.map((val) =>
        typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
      );
  
    let sql = `INSERT INTO ${marketcheck_vehicle_build_info?.tablename} (${keys.map(
        (key) => `\`${key}\``
      )}) VALUES (${sanitizedValues})`;
  
       pool.query(sql, (err, result) => {
        if (err) {
          console.log("vindecoder vbi page", err);
          reject(err)
        //   return send_sqlError(res);
        }
        resolve(result)
      })
    })
}

const VinDecoder = async (res,vin) => {
  try {
    const hostedUrl = "api.marketcheck.com";
    const hostHeader = "marketcheck-prod.apigee.net";
    const api_key = "M8XZ1ilmwWAAuSZSG8rfkrA4XH70EDoU";
    const result = await axios({
      url: `http://${hostedUrl}/v2/decode/car/${vin}/specs?api_key=${api_key}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        host: hostHeader,
      },
    });

      const data = result?.data;
      if(data?.code === 422){
        const obj = {
          res,
          status: false,
          code: NOT_FOUND,
          errors: ["Unable to fetch entered vin number's detail."],
        }
        return send_response(obj)
      }

      const buildData = {
        vin,
        year: data?.year ? data?.year : "",
        make: data?.make ? data?.make : "",
        model: data?.model ? data?.model : "",
        fuel_type: data?.fuel_type ? data?.fuel_type : "",
        doors: data?.doors ? data?.doors : "",
        cylinders: data?.cylinders ? data?.cylinders : "",
        engine: data?.engine ? data?.engine : "",
        transmission: data?.transmission ? data?.transmission : "",
        trim: data?.trim ? data?.trim : "",
        body_type: data?.body_type ? data?.body_type : "",
        drivetrain: data?.drivetrain ? data?.drivetrain : "",
        std_seating: data?.std_seating ? data?.std_seating : "",
        highway_mpg: data?.highway_mpg ? data?.highway_mpg : "",
        city_mpg: data?.city_mpg ? data?.city_mpg : "",
      }
      await InsertBuildData(res,buildData)
      return ;

  } catch (err) {
    console.log("vindecoder ",err);
    const obj = {
        res,
        status: false,
        code: NOT_FOUND,
        errors: ["Unable to fetch entered vin number's detail."],
      }
      return send_response(obj)
  }
};

module.exports = VinDecoder;
