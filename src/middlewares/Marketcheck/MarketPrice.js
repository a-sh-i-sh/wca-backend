const axios = require("axios");

const MarketCheckUsedCar = async (vin,miles) => {
  try {
    const hostedUrl = "api.marketcheck.com";
    const hostHeader = "marketcheck-prod.apigee.net";
    const api_key = "DosWiXXrYCAJJk7vWb5IinkSHYYLlBGW";
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
      if(data?.code === 422){
        return 400;
      }
      return {"trade_price":data?.predicted_price, "year": data?.specs?.year, 
      "make": data?.specs?.make, "model": data?.specs?.model, 
      "miles": data?.specs?.miles,
      "base_exterior_color": data?.specs?.base_exterior_color,
      "base_interior_color": data?.specs?.base_interior_color,
      "engine_size": data?.specs?.engine_size,
      "cylinders": data?.specs?.cylinders,
      "doors": data?.specs?.doors,
    };

  } catch (err) {
    console.log(err);
    return 400;
  }
};

module.exports = MarketCheckUsedCar;
