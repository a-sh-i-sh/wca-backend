const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const pool = require("../../connection/db");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const LocalMarket = async (req, res, next) => {
  const {
    OK_AND_COMPLETED,
    INTERNAL_SERVER_ERROR,
  } = require("../../config/const");
  // app.post('/localMarket', async (req, res) => {
  var zip = req.body.zip;
  var distance = req.body.distance;
  // try {
    const result = await axios({
      url: `https://www.cars.com/shopping/results/?&maximum_distance=${distance}&zip=${zip}`,
      method: "GET",
      headers: { 
        'Cookie': '_abck=91E7889F9F311245E674BC66A5EF5E18~-1~YAAQfbYRYFBuk1yHAQAAKeFOfgnKQxlyc5rqHt1tY4Zmnlv5WhFhV8SOB4L48IwMU5AYQ8vXtZleG9Zv5oCjCQfCTnnvxPFcFSxsK22yljZP3IdnyMKkz/m59dlpLUOtt6hGxoPpeaswcEPzbbnMzW76ieX0y7FkSWFYrvqcbgzaXp+N4kNVBldkNWy3pMgETERiQrqDOFzOIRW2JOcPw8R+mj/2BVxck6km2SYBCgbf0pst3drmAk0ro4Vtj7klOywl+nKncrvqz+OIkgzPWBr+jK6AubWWRj2UAUWyobDkaIT/4vEOL/PgnlCKefaDvOdNa+7XdX1b5NgRFXKJ8W09SIHC4eHa3gtmCtDdMJGT+w/jWa9+~-1~-1~-1; bm_sz=15B09AE13B8B03D29DF3B35ADEF2967C~YAAQfbYRYFJuk1yHAQAAKeFOfhMCUYC76bch0c3X7HWuqqntmNwnCRa0XIjRP1aCRFHsbgCV8Rw7zgq2hmgaf7CViouMJvQzYPwaYSdMr9Z5sp+TXKfxsRowyQJxtm/2LqXrWhvK7fDqTuKp/OOzJS2t4aSWPML55xqKNLPiIXCMOgJ4101IGGxZwQrto9zHMzAplCwwFVwUwDVEZo/N2sQnxUNrsxBsYVfG6v5Zq7Uk/CSKZl39Q/zHc1uPMjl2bNHT9h3PXP5ISFf7WVfrHarWoQzwbI6JYYCTdCs+OP/i~4604210~3553094; CARS_als_loaded=true; CARS_experience_testing={"session_id":"36201c23-438e-4549-842e-2610e5b7b766","tnt_id":"36201c23-438e-4549-842e-2610e5b7b766.34_0"}; CARS_has_visited=; CARS_logged_in=false; CARS_marketing_source=SFMyNTY.g2gDdAAAAARkAApfX3N0cnVjdF9fZAAjRWxpeGlyLkNhcnNXZWIuUGx1Zy5NYXJrZXRpbmdTb3VyY2VkAAhhZmZfY29kZW0AAAAIbmF0aW9uYWxkAAxjbGlja19zb3VyY2V0AAAAAGQAA3V0bXQAAAAAbgYAwNxOfocBYgABUYA.C1MvyH4-rCXbIL62ujMEtqZ-1CZMdaiBWTSCQu0O-jc; _cars_web_key=SFMyNTY.g3QAAAALbQAAAAtfY3NyZl90b2tlbm0AAAAYZk9GVTR1dHBEelhqUnI3QUJtTWs0N21NbQAAABBhbHNfcHJpdmF0ZV9kYXRhbQAAALZRVEV5T0VkRFRRLk1uR0xVeHlreWhZenRHX0syVVoxMGxMTXk1alNZMldFZVRSN3hSQUNzU2pmRXViYl9BSF9hWXJUSlFVLjVaai1HSGZCNXpQT0tOcGsuNTJ3bjI1Vkk0dDBkSVlKeGxjY2NsSzhTUG9aTmU3MTU3VFN4bWp0VUFKSm1EejNwVEl5VmZuWDF0TkhnWWdsdFpnUWZBVHMuVU11N0FvdHJibGVTc1VYWU1tejhjQW0AAAARZmFjZWJvb2tfZXZlbnRfaWRtAAAAVGRISnBjRjlwWkQxalpEUmxZV0kyTkMxaU5qSTJMVFExT0dZdE9XUm1NeTAzT0RrMk9XRmpaRGcwTW1VbWRITTlNVFk0TVRRMU1UTXhNREkzTWc9PW0AAAAYZmFjZWJvb2tfZXZlbnRfaW50ZW50X2lkbQAAAA5jYXBpX3Zpdl9ldmVudG0AAAALZmFsbGJhY2tfaWRtAAAAJGNkNGVhYjY0LWI2MjYtNDU4Zi05ZGYzLTc4OTY5YWNkODQyZW0AAAAPZ3JhcGhxbF9hcGlfa2V5bQAAACA1cnJtbldWbDFNRHpQY0VuRHZFcDNQdTEwMUlHWEVHb20AAAANaXNfc2VhcmNoX2JvdGQABWZhbHNlbQAAABBsYXN0X3ZpZXdlZF9wYWdlbQAAABIvc2hvcHBpbmcvcmVzdWx0cy9tAAAAEHRvdGFsX3BhZ2Vfdmlld3NhAW0AAAANd2ViX3BhZ2VfdHlwZW0AAAAXc2hvcHBpbmcvc2VhcmNoLXJlc3VsdHNtAAAAEndlYl9wYWdlX3R5cGVfZnJvbW0AAAAA.6JJdTAuL0e3sf3rKC2c3ENwa_L_Aweh46yNC-JLB8qA; fallback_id=cd4eab64-b626-458f-9df3-78969acd842e'
      }
    });
    var $ = cheerio.load(result.data);

    var data = $(".listings-page").attr("data-site-activity");
    var r = JSON.parse(data);
    var resp = r.vehicleArray;
    const cars = [];
    $(".vehicle-card").each((i, el) => {
      const car = {};
      car.img =
        $(el).find(".vehicle-image").attr("data-src") ||
        $(el).find(".vehicle-image").attr("src");
      cars.push(car);
    });
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
        if (index == ind) i.image = j.img;
      });
    });
    const data1 = [];
    $(".listings-page").each((i, el) => {
      const d1 = {};
      d1.engine = $(el).find("script").text().trim();
      data1.push(d1);
    });
    // console.log(data1);
    const obj = {
      res,
      status: true,
      code: OK_AND_COMPLETED,
      data: resp,
      message: "Data Found Successfully",
    };
    return send_response(obj);
  // } catch (err) {
  //   console.log("helllo",err)
  //   const obj = {
  //     res,
  //     status: false,
  //     code: INTERNAL_SERVER_ERROR,
  //     errors: ["Internal Error"],
  //   };
  //   return send_response(obj);
  // }
};
module.exports = { LocalMarket };
