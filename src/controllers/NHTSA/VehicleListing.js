const axios = require('axios')

const VehicleListing = async (req,res) => {
  // /vehicles/GetAllMakes?format=json
const result = await axios({
    url: "https://vpic.nhtsa.dot.gov/api"+"/vehicles/DecodeVin/5UXWX7C5*BA?format=json&modelyear=2011",
    // url: "https://api.vinaudit.com/v2/query?vin=1VXBR12EXCP901214&key=VA_DEMO_KEY&format=json" // api for getting particular vehicle information
    method: "GET",
    // data,
    // body:JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    //   Authorization: "Basic :",
    },

  });

  // console.log("Res",result?.data)
  res.json({status: true, data: result?.data})
}

module.exports = VehicleListing