const axios = require("axios");
const { BAD_REQUEST, OK } = require("../../config/const");

const MarketPrice = async (req, res, next) => {
  try {
    const vin = req.body.vin;
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

    //   console.log("Response",result?.data)
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

module.exports = MarketPrice;
