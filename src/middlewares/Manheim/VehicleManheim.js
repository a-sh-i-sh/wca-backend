const axios = require('axios')

const VehicleManheim = async (req,res) => {

const data = {
    grant_type: "Palakbhagi@29",
    username: "palakbhagi",
    password: "Palakbhagi@29"
}
const result = await axios({
    url: "http://developer.manheim.com/#/apis/marketplace/valuations",
    method: "POST",
    // data,
    // body:JSON.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    //   Accept: "application/json",
      Authorization: "Basic :",
    },
    
  });

  // console.log("Res",result?.data)
  res.json({status: true, data: result?.data})
}

module.exports = VehicleManheim