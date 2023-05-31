const pool = require("../../connection/db");
const multer  = require('multer')
const path = require('path');
const { PRECONDITION_FAILED, OK } = require("../../config/const");
const { send_response } = require("../../config/reponseObject");



const QueryForUpdate = (sql, values) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, values, (err, result) => {
       if (err) {
         console.log("listsearch vdi page", err);
         reject(err)
       }
       console.log("result... ",result);
       resolve(result)
     });
   })
  }



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/controllers/UploadImages/')
    },
    filename: (req, file, cb) => {
        // console.log("file ",file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    /* console.log(req.rawHeaders)
      let current_file_size = req.rawHeaders.slice(-1)[0]
      console.log(current_file_size) */
    if(req.fileValidationerror || req.loopValidationerror){
      cb(null, false);
    }else{
      let file_extension = path.extname(file.originalname).toLowerCase()
      if(file.fieldname === 'car_images'){
        if( file_extension===".jpg" ||  file_extension===".png" ||  file_extension===".jpeg"){
          if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
            cb(null, file.mimetype,true );
          } else {
              req.fileValidationerror = "Only jpeg,png,jpg images allowed to be uploaded";
              //cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
              cb(null, false);
          }  
        } else {
          req.fileValidationerror = "Only jpeg,png,jpg images allowed to be uploaded";
          cb(null, false);
        }    
      }else{
        cb(null, false);
      } 
    }    
  };




const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024, // 250 kB size limit (adjust the limit as per your requirements)
      },    
}).array("car_images")

// const textUpload = multer().none();





const imageValidation = async (req, res) => {

//   textUpload(req, res, (err) => {
//         console.log("Only text fields coming in this", req.body)
//     })


   upload(req, res, async (err) => {
        if(req.fileValidationerror || req.loopValidationerror){
            if(req.fileValidationerror){
                const obj = {
                    res,
                    status: false,
                    code: PRECONDITION_FAILED,
                    errors: [req.fileValidationerror]
                }
               return send_response(obj)
            }
            if(req.loopValidationerror){
                const obj = {
                    res,
                    status: false,
                    code: PRECONDITION_FAILED,
                    errors: [req.loopValidationerror]
                }
               return send_response(obj)
            }
            
          }else if(err){
            console.log("validation error ",err)
            if(err.code === 'LIMIT_FILE_SIZE'){
                const obj = {
                    res,
                    status: false,
                    code: PRECONDITION_FAILED,
                    errors: [`File Size is too large. Allowed file size is ${100} kB`]  // max_file_size = 250kB
                }
               return send_response(obj)
            }
          } else{
          const obj_body = JSON.parse(JSON.stringify(req.body));
          req.body = obj_body

        //   console.log("When textUpload then use this", req.body.vin[0])
        let keys = ["vin", "image_url"].join(", ");
        for(let index=0; index < req.files.length; index++){
            const values = [req.body.vin, req.files[index].filename];
        let sql = `INSERT INTO wca_vehicles_images (${keys}) VALUES (?, ?)`
        await QueryForUpdate(sql, values);
        }
         console.log("end");
          
        const obj = {
            res,
            status: true,
            code: OK,
            message: "Images added successfully"
        }
        return send_response(obj)
          }    
        })


}

module.exports = {upload, imageValidation};