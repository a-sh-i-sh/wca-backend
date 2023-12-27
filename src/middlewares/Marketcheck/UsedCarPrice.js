const axios = require("axios");
const { NOT_FOUND } = require("../../config/const");
const { send_response } = require("../../config/reponseObject");

const MarketCheckUsedCar = async (vin, miles) => {
  try {
    const hostedUrl = "api.marketcheck.com";
    const hostHeader = "marketcheck-prod.apigee.net";
    const api_key = "M8XZ1ilmwWAAuSZSG8rfkrA4XH70EDoU";
    const result = await axios({
      url: `http://${hostedUrl}/v2/predict/car/price?api_key=${api_key}&car_type=used&vin=${vin}&miles=${miles}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        host: hostHeader,
      },
    });

    const data = result?.data;
    if (data?.code === 422) {
      // const obj = {
      //   res,
      //   status: false,
      //   code: NOT_FOUND,
      //   errors: data?.message ? [data?.message] : ["Unable to fetch this vin number's detail from marketcheck"],
      // }
      // return send_response(obj)
      return 400;
    }
    return {
      trade_price: data?.predicted_price,
      miles: data?.specs?.miles,
      year: data?.specs?.year,
      make: data?.specs?.make,
      model: data?.specs?.model,
      base_ext_color: data?.specs?.base_exterior_color,
      base_int_color: data?.specs?.base_interior_color,
      // engine_size: data?.specs?.engine_size,
      // cylinders: data?.specs?.cylinders,
      // doors: data?.specs?.doors,
    };
  } catch (err) {
    console.log(err);
    return 400;
  }
};

module.exports = MarketCheckUsedCar;
