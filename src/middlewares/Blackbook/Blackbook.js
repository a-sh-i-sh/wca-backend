const axios = require("axios");
const { OK, BAD_REQUEST } = require("../../config/const");

const Blackbook = async (req, res, next) => {
  try {
    let vin = req.body.vin;
    let username = "WeCashAutosAPI";
    let password = "7MR35W6w";
    let auth =
      "Basic " + new Buffer.from(username + ":" + password).toString("base64");
    const result = await axios({
      url: `https://service.blackbookcloud.com/UsedCarWS/UsedCarWS/UsedVehicle/VIN/${vin}?customerid=test`,
      method: "GET",
      // data,
      // body:JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: auth,
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
      errors: ["Unable to fetch blackbook used car web api data"],
    });
  }
};

module.exports = Blackbook;
