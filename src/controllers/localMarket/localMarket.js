const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const pool = require("../../connection/db");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const LocalMarket = async (req, res, next) => {
    const {
        OK_AND_COMPLETED,
      } = require("../../config/const");
    // app.post('/localMarket', async (req, res) => {
    var zip = req.body.zip
    var distance = req.body.distance
    const result = await axios({
        url: `https://www.cars.com/shopping/results/?&maximum_distance=${distance}&zip=${zip}`,
        method: "GET",
    });
    var $ = cheerio.load(result.data);
    const cars = [];

    $('.vehicle-card').each((i, el) => {
        const car = {};
        car.title = $(el).find('.title').text().trim();
        car.price = $(el).find('.primary-price').text();
        car.mileage = $(el).find('.mileage').text();
        car.rating = $(el).find('.sds-rating__count').text();
        car.id = $(el).attr('data-listing-id')
        cars.push(car);
    });
    var detail = ''
    const data = [];
     cars.map(async (item) => {
        detail = await axios({
            url: `https://www.cars.com/vehicledetail/${item.id}/`,
            method: "GET",
            // data,
            // body:JSON.stringify(data),
        }),
            $ = cheerio.load(detail.data),
            $(".basics-section .fancy-description-list").each((index, element) => {
                const carsDetails = {};
                if (index === 0) {
                    // carsDetails.id = item.id
                    item.exterior_color = $(element).find('dd:nth-child(2)').text().trim()
                    item.interior_color = $(element).find('dd:nth-child(4)').text().trim()
                    item.drivetrain = $(element).find('dd:nth-child(6)').text().trim()
                    item.MPG = $(element).find('dd:nth-child(8)').text().trim()
                    item.Fuel_type = $(element).find('dd:nth-child(10)').text().trim()
                    item.Transmission = $(element).find('dd:nth-child(12)').text().trim()
                    item.Engine = $(element).find('dd:nth-child(14)').text().trim()
                    item.VIN = $(element).find('dd:nth-child(16)').text().trim()
                    data.push(item)
                }
            })
        return data
    })
    console.log(cars)
    console.log(data);
    // d.then(function(res){
    //     console.log(res);
    // })
    const obj = {
        res,
        status: true,
        code:OK_AND_COMPLETED,
        data:cars,
        message:"Data Found Successfully"
      };
      return send_response(obj);
    
}
module.exports = {
    LocalMarket,
};