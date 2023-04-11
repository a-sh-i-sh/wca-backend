const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
const pool = require("../../connection/db");
app.post('/localMarket', async (req, res) => {
    console.log(req.body);
    var zip = req.body.zip
    var distance = req.body.distance
    const url = `https://www.cars.com/shopping/results/?&maximum_distance=${distance}&zip=${zip}`
    axios.get(url)
      .then(response => {
        const $ = cheerio.load(response.data);
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
        var q = ''
        var detailsUrl
        carsDetail = []
        const carsDetails = {};
  
        cars.map((item) => (
          detailsUrl = `https://www.cars.com/vehicledetail/${item.id}/`,
          axios.get(detailsUrl)
            .then(response => {
              const $ = cheerio.load(response.data);
              $("dl").each((index, element) => {
                if (index === 0) {
                  carsDetails.id = item.id
                  carsDetails.exterior_color = $(element).find('dd:nth-child(2)').text().trim()
                  carsDetails.interior_color = $(element).find('dd:nth-child(4)').text().trim()
                  carsDetails.drivetrain = $(element).find('dd:nth-child(6)').text().trim()
                  carsDetails.MPG = $(element).find('dd:nth-child(8)').text().trim()
                  carsDetails.Fuel_type = $(element).find('dd:nth-child(10)').text().trim()
                  carsDetails.Transmission = $(element).find('dd:nth-child(12)').text().trim()
                  carsDetails.Engine = $(element).find('dd:nth-child(14)').text().trim()
                  carsDetails.VIN = $(element).find('dd:nth-child(16)').text().trim()
                }
              });
              carsDetail.push(carsDetails);
              var q1
              carsDetail.map((data) => (
                q1 = `INSERT INTO car_detail (id,exterior_color,interior_color,drivetrain,MPG,Fuel_type,Transmission,Engine,VIN) VALUES ('${data.id}','${data.exterior_color}','${data.interior_color}','${data.drivetrain}','${data.MPG}','${data.Fuel_type}' ,'${data.Transmission}' ,'${data.Engine}'  ,'${data.VIN}' )`,
                pool.query(q1, (err, result) => {
                  if (err) throw err;
                })
              ))
            })
        ))
      })
    const sql = 'SELECT Scrape.id, Scrape.title, Scrape.price,Scrape.mileage,Scrape.rating,car_detail.VIN,car_detail.Engine  FROM car_detail INNER JOIN Scrape ON car_detail.id=Scrape.id;'
    pool.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send({
        data: result
      })
    })
  })