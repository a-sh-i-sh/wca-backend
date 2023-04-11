const axios = require("axios");
const { BAD_REQUEST, OK } = require("../../config/const");

const MarketCheckUsedCar = async (vin) => {
  try {
    const hostedUrl = "api.marketcheck.com";
    const hostHeader = "marketcheck-prod.apigee.net";
    const api_key = "DosWiXXrYCAJJk7vWb5IinkSHYYLlBGW";
    const result = await axios({
      url: `http://${hostedUrl}/v2/predict/car/price?api_key=${api_key}&car_type=used&vin=${vin}&miles=28741&base_exterior_color=Black&base_interior_color=Brown&zip=55033`,
      method: "GET",
      // data,
      // body:JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        host: hostHeader,
      },
    });

      const data = result?.data;
      return {"trade_price":data?.predicted_price, "year": data?.specs?.year, 
      "make": data?.specs?.make, "model": data?.specs?.model, 
      "base_exterior_color": data?.specs?.base_exterior_color,
      "base_interior_color": data?.specs?.base_interior_color,
    };

  } catch (err) {
    console.log(err);
    return 400;
  }
};

module.exports = MarketCheckUsedCar;
