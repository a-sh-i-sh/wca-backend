const axios = require('axios')

const VehicleListing = async (req,res) => {

const result = await axios({
    url: "https://vpic.nhtsa.dot.gov/api"+"/vehicles/GetAllManufacturers?format=json&page=2",
    method: "GET",
    // data,
    // body:JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    //   Authorization: "Basic :",
    },

  });

  console.log("Res",result?.data)
  res.status(200).json({status: true, data: result?.data})
}

module.exports = VehicleListing