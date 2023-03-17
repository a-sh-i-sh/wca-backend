const axios = require('axios')

const VehicleManheim = async (req,res) => {
console.log("ram",req.body);
const data = {
    grant_type: "Palakbhagi@29",
    username: "palakbhagi",
    password: "Palakbhagi@29"
}
const result = await axios({
    url: "https://api.manheim.com/oauth2/token.oauth2",
    method: "POST",
    data,
    // body:JSON.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    //   Accept: "application/json",
      Authorization: "Basic :",
    },
  });

  console.log("Res",result)
}

module.exports = VehicleManheim