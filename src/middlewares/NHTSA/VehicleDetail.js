const axios = require("axios");
const { OK, BAD_REQUEST } = require("../../config/const");

const VehicleDetail = async (vin) => {
  try {

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

    console.log("Res",result?.data)
    const data = result?.data?.Results[0];
    console.log("res",data)
    return {
      make: data?.Make,
      year: data?.ModelYear,
      model: data?.Model,
    }
  } catch (err) {
    console.log(err);
    return 400;
  }
};

module.exports = VehicleDetail;
