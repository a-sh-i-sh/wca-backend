const { NOT_FOUND } = require("../../config/const");
const {
  INTERNAL_SERVER_ERROR,
  CREATED,
  PROMPT_CODE,
  OK_AND_COMPLETED,
  OK_WITH_CONFLICT,
  BAD_REQUEST,
} = require("../../config/const");
const {
  marketcheck_vehicle_info,
  marketcheck_vehicle_build_info,
  marketcheck_vehicle_dealer_info,
  marketcheck_vehicle_media_info,
} = require("../../config/constTablesStruct");
const {
  EncryptedData,
  DecryptedData,
} = require("../../config/encrypt_decrypt");
const { send_sqlError, send_response } = require("../../config/reponseObject");
const pool = require("../../connection/db");
const Blackbook = require("../../middlewares/Blackbook/Blackbook");
const MarketCheckUsedCar = require("../../middlewares/Marketcheck/UsedCarPrice");
const VinDecoder = require("../../middlewares/Marketcheck/VinDecoder");
const VehicleDetail = require("../../middlewares/NHTSA/VehicleDetail");

const buildMarketcheckData = (vin) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ${marketcheck_vehicle_info.miles},
    ${marketcheck_vehicle_info.trade_price},
    ${marketcheck_vehicle_info.base_int_color},
    ${marketcheck_vehicle_info.base_ext_color},
    ${marketcheck_vehicle_build_info?.make},
    ${marketcheck_vehicle_build_info?.year},
    ${marketcheck_vehicle_build_info?.model} 
    FROM ${marketcheck_vehicle_info.tablename} t1
    RIGHT JOIN ${marketcheck_vehicle_build_info.tablename} t2 ON t1.vin = t2.vin
    WHERE t2.vin = ?`;
    pool.query(sql, [vin], (err, result) => {
      if (err) {
        console.log("vehicle market build DATA", err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const mediaMarketcheckData = (vin, type) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT ${marketcheck_vehicle_media_info?.photo_link} AS image_url,${marketcheck_vehicle_media_info?.type}
     FROM ${marketcheck_vehicle_media_info?.tablename} WHERE vin = ? AND type = ?`;
    pool.query(sql, [vin, type], (err, result) => {
      if (err) {
        console.log("vehicle market media DATA", err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const marketCheckAllData = (vin) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM ${marketcheck_vehicle_info.tablename} t1 
            RIGHT JOIN ${marketcheck_vehicle_dealer_info.tablename} t2 ON t1.vin = t2.vin 
            RIGHT JOIN ${marketcheck_vehicle_build_info.tablename} t3 ON t1.vin = t3.vin 
            WHERE t3.vin = ? `
    pool.query(sql, [vin], (err, result) => {
      if (err) {
        console.log("vehicle marketALL data", err);
        reject(err);
      }
      resolve(result);
    });
  });
};

const AddVehicles = async (req, res, next) => {
  if (req.body.vehicles_id === "") {
    try {
      const created_on = new Date();

      let data = await buildMarketcheckData(req.body.vin);
      if (data?.length === 0) {
      //  await VinDecoder(res,req.body.vin);
      //  console.log("vindecoder ended: ")
      //  data = await buildMarketcheckData(req.body.vin);
      //  console.log("build after vind. ended: ",data)
      const obj = {
        res,
        status: false,
        code: NOT_FOUND,
        errors: ["This vin number doesn't exist"],
      };
      return send_response(obj);
      }
      
      const keys = ["vin", "make", "year", "model", "base", "miles", "trade_price", "base_int_color", "base_ext_color", "createdOn"];
      const values = [
        req.body.vin,
        data[0].make,
        data[0].year,
        data[0].model,
        data[0].miles,
        data[0].miles,
        data[0].trade_price,
        data[0].base_int_color,
        data[0].base_ext_color, 
        created_on,
      ];
      const sql = `INSERT INTO wca_negotiating_vehicles (${keys}) VALUES (?)`;
      await pool.query(sql, [values], (err, result) => {
        if (err) {
          console.log("vehicle page", err);
          return send_sqlError(res);
          // return res.status(INTERNAL_SERVER_ERROR).json({
          //   status: false,
          //   code: INTERNAL_SERVER_ERROR,
          //   message: "",
          //   errors: ["Unable to add vehicle in the list"],
          // });
        }
        if (result.affectedRows) {
          const obj = {
            res,
            status: true,
            code: CREATED,
            message: "Vehicle added successfully",
          };
          return send_response(obj);
        } else {
          const obj = {
            res,
            status: false,
            code: PROMPT_CODE,
            errors: ["Unable to add vehicle in the list"],
          };
          return send_response(obj);
        }
      });
    } catch (err) {
      console.log("add vehicle",err)
      const obj = {
        res,
        status: false,
        code: INTERNAL_SERVER_ERROR,
        errors: ["Unable to add vehicle in the list"],
      };
      return send_response(obj);
    }
  } else {
    next();
  }
};

const getAll = (search) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wca_negotiating_vehicles WHERE is_deleted = 0
    AND ( vin LIKE '%${search}%'
    OR make LIKE '%${search}%'
    OR year LIKE '%${search}%'
    OR model LIKE '%${search}%'
    OR miles LIKE '%${search}%'
    OR trade_price LIKE '%${search}%'
    OR base_int_color LIKE '%${search}%'
    OR base_ext_color LIKE '%${search}%'
    OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%' )`;
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result.length);
    });
  });
};

const getVehiclesList = async (req, res) => {
  try {
    const page = req.body.page ? Number(req.body.page) : 1;
    const limit = req.body.limit ? Number(req.body.limit) : 5;
    const skip = (page - 1) * limit;
    const sortColumn = req.body.sortColumn ? req.body.sortColumn : "createdOn";
    const sort = req.body.sort;
    const search = req.body.search ? req.body.search : "";

    const total_records = await getAll(search);
    const pages =
      total_records % limit === 0
        ? Math.trunc(total_records / limit)
        : Math.trunc(total_records / limit) + 1;

    const sql = `SELECT vehicles_id,vin,make,year,model,miles,trade_price,base_int_color,base_ext_color,DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p')
      AS created_on FROM wca_negotiating_vehicles WHERE is_deleted = 0
  AND ( vin LIKE '%${search}%'
  OR make LIKE '%${search}%'
  OR year LIKE '%${search}%'
  OR model LIKE '%${search}%'
  OR miles LIKE '%${search}%'
  OR trade_price LIKE '%${search}%'
  OR base_int_color LIKE '%${search}%'
  OR base_ext_color LIKE '%${search}%'
  OR DATE_FORMAT(createdOn,'%d/%m/%Y %h:%i %p') LIKE '%${search}%' )
  ORDER BY ${sortColumn} ${sort}
  LIMIT ${skip},${limit}`;
    await pool.query(sql, (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to fetch Vehicles List"],
        // });
      }

      if (result.length) {
        result.map((item, index) => {
          item.vehicles_id = EncryptedData(item.vehicles_id);
        });
      }
      const obj = {
        res,
        status: true,
        code: OK_AND_COMPLETED,
        message: result?.length
          ? "Vehicles List found successfully"
          : "No record found",
        data: {
          vehicles_list: result,
          page,
          pages,
          page_records: result.length,
          total_records,
        },
      };
      return send_response(obj);
    });
  } catch (error) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to fetch Vehicles List"],
    };
    return send_response(obj);
  }
};

const getVehiclesById = async (req, res) => {
  try {
    const sql = `Select vehicles_id,vin,make,year,model,base,miles,trade_price,base_int_color,base_ext_color,purchase_price FROM wca_negotiating_vehicles WHERE is_deleted = 0 AND vehicles_id = ?`;
    await pool.query(sql, [req.body.vehicles_id], async (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to get vehicle details"],
        // });
      }

      if (result.length) {
        result[0].vehicles_id = req.body.vehicles_id;
      } 
      let MarketcheckArray = await marketCheckAllData(result[0]?.vin);
      let MarketcheckData = MarketcheckArray[0];
      if (MarketcheckData?.id || MarketcheckData?.vehicle_id) {
        ["id","vehicle_id","vin","make","year","model","miles","trade_price","base_int_color","base_ext_color"].forEach((e) => delete MarketcheckData[e]);
      }
      Object.assign(result[0], MarketcheckData);


     MarketcheckArray = await mediaMarketcheckData(result[0]?.vin,1);
     MarketcheckArray.map((item,ind) => {
      item.image_url = decodeURIComponent(item.image_url)
     })

    //  CarsImagesArray = await 
     
     Object.assign(result[0], {photo_links: MarketcheckArray})

     MarketcheckArray = await mediaMarketcheckData(result[0]?.vin,2);
     MarketcheckArray.map((item,ind) => {
      item.image_url = decodeURIComponent(item.image_url)
     })
     Object.assign(result[0], {photo_links_cached: MarketcheckArray})
     

      const obj = {
        res,
        status: true,
        code: OK_AND_COMPLETED,
        message: result?.length
          ? "Vehicle details found successfully"
          : "No record found",
        data: result?.length ? result[0] : {},
      };
      return send_response(obj);
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to get vehicle details"],
    };
    return send_response(obj);
  }
};

const deleteVehiclesById = async (req, res) => {
  try {
    const sql = `update wca_negotiating_vehicles set is_deleted=? where vehicles_id=?`;
    await pool.query(sql, [1, req.body.vehicles_id], async (err, result) => {
      if (err) {
        return send_sqlError(res);
        // return res.status(INTERNAL_SERVER_ERROR).json({
        //   status: false,
        //   code: INTERNAL_SERVER_ERROR,
        //   message: "",
        //   errors: ["Unable to remove vehicle from list"],
        // });
      }
      if (result.affectedRows) {
        const obj = {
          res,
          status: true,
          code: OK_AND_COMPLETED,
          message: "Vehicle removed successfully",
        };
        return send_response(obj);
      } else {
        const obj = {
          res,
          status: false,
          code: BAD_REQUEST,
          errors: ["Vehicle record doesn't exist"],
        };
        return send_response(obj);
      }
    });
  } catch (err) {
    const obj = {
      res,
      status: false,
      code: INTERNAL_SERVER_ERROR,
      errors: ["Unable to remove vehicle from list"],
    };
    return send_response(obj);
  }
};

module.exports = {
  buildMarketcheckData,
  AddVehicles,
  getVehiclesList,
  getVehiclesById,
  deleteVehiclesById,
};
