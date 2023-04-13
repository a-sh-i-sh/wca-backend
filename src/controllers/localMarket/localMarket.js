const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const pool = require("../../connection/db");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const LocalMarket = async (req, res, next) => {
    const {
        OK_AND_COMPLETED, INTERNAL_SERVER_ERROR,
    } = require("../../config/const");
    // app.post('/localMarket', async (req, res) => {
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
    $('.vehicle-card').each((i, el) => {
        const car = {};
        car.img = $(el).find('.vehicle-image').attr('data-src') || $(el).find('.vehicle-image').attr('src')
        cars.push(car)
    })
    const engines = [];
    // resp.forEach(async (i,index) => {
    //     const ress = await axios({
    //         url: `https://www.cars.com/vehicledetail/${i.listing_id}/`,
    //         method: "GET",
    //     });
    //     var $ = cheerio.load(ress.data);
    //     $('.fancy-description-list').each((indexs, el) => {
    //         const detail = {};
    //         i.engine = $(el).find('dd:nth-child(12)').text()
    //         cars.push(i)
    //     })
    //     // engines.forEach((j,ind) => {
    //     //     if (index == ind)
    //     //         i.engine = j.engine
    //     //     // console.log(resp);
    //     // })
    // })
    resp.forEach((i, index) => {
        cars.forEach((j, ind) => {
            if (index == ind)
                i.image = j.img
        })
    })
    const data1 = [];
    $('.listings-page').each((i, el) => {
        const d1={}
         d1.engine = $(el).find('script').text().trim()
        data1.push(d1)
    })
    console.log(data1);
    const obj = {
        res,
        status: true,
        code: OK_AND_COMPLETED,
        data: resp,
        message: "Data Found Successfully"
    };
    return send_response(obj);
}catch(err){
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