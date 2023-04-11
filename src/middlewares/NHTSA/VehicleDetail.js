const axios = require("axios");
const { OK, BAD_REQUEST } = require("../../config/const");

const VehicleDetail = async (req, res, next) => {
  try {
    const vin = req.body.vin;

    const result = await axios({
      url: "https://vpic.nhtsa.dot.gov/api" + `/vehicles/DecodeVinValuesExtended/${vin}?format=json`, //"/vehicles/GetAllMakes?format=json", //"/vehicles/GetVehicleVariableValuesList/2?format=json",
      // url: "https://api.nhtsa.gov"+"/SafetyRatings/modelyear/2013/make/Acura/model/rdx", // api for getting particular vehicle information
      method: "GET",
      // data,
      // body:JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // console.log("Res",result?.data)
    res.json({
      status: true,
      code: OK,
      message: "Request successful",
      data: result?.data,
      errors: [],
    });
  } catch (err) {
    res.json({
      status: false,
      code: BAD_REQUEST,
      message: "",
      errors: ["Unable to fetch market price used car api data"],
    });
  }
};

module.exports = VehicleDetail;
