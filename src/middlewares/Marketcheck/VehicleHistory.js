const axios = require("axios");

const VehicleHistory = async (vin) => {
  try {
    const hostedUrl = "api.marketcheck.com";
    const hostHeader = "marketcheck-prod.apigee.net";
    const api_key = "DosWiXXrYCAJJk7vWb5IinkSHYYLlBGW";
    const result = await axios({
      url: `http://${hostedUrl}/v2/history/car/${vin}?api_key=${api_key}&fields=seller_type,dealer_id,seller_name,seller_phone,seller_email,vdp_url,source,last_seen_at,price,miles,city,state,zip,scraped_at`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        host: hostHeader,
      },
    });

      const data = result?.data;
      return data; // give array of objects with fields(send in payloads)

  } catch (err) {
    console.log(err);
    return 400;
  }
};

module.exports = VehicleHistory;
