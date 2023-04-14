const axios = require('axios')
const cheerio = require('cheerio')
const { send_response } = require("../../config/reponseObject");

const LocalMarket = async (req, res, next) => {
    const {
        OK_AND_COMPLETED, INTERNAL_SERVER_ERROR,
    } = require("../../config/const");
    var zip = req.body.zip
    var distance = req.body.distance
    try {
        const result = await axios({
            url: `https://www.cars.com/shopping/results/?&maximum_distance=${distance}&zip=${zip}`,
            method: "GET",
        });
        var $ = cheerio.load(result.data);
        var data = $('.listings-page').attr('data-site-activity')
        var r = JSON.parse(data);
        var resp = r.vehicleArray
        const cars = [];
        const car = {};
        $('.vehicle-card').each((i, el) => {
            cars.push({ img: $(el).find('.vehicle-image').attr('data-src') || $(el).find('.vehicle-image').attr('src') })
        })
        cars.forEach((j, ind) => {
            resp[ind].image = j.img
        })
        const data1 = [];
        var length = resp.length
        $('.listings-page').each((i, el) => {
            for (let index = 1; index <= length; index++) {
                data1.push({ engine: $(el).find('script')?.get(index) })
            }
        })
        data1.forEach((i, index) => {
            var dd = JSON.parse(i?.engine?.firstChild?.data);
            resp[index].engine = dd?.vehicleEngine?.name
        })
        const obj = {
            res,
            status: true,
            code: OK_AND_COMPLETED,
            data: resp,
            message: "Data Found Successfully"
        };
        return send_response(obj);
    } catch (err) {
        console.log(err);
        const obj = {
            res,
            status: false,
            code: INTERNAL_SERVER_ERROR,
            data: ['Internal Error'],
        };
        return send_response(obj);
    }
}
module.exports = {
    LocalMarket,
};