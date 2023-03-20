require('dotenv').config();
const jwt = require('jsonwebtoken')

const TokenVerify = (req,res,next) => {
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err,valid) => {
            if(err){
                res.status(statusCodes.RESPONSE_CODES.UNAUTHORIZED).json({status: false, messages: "Your token is expired, please login again",errors:["Your token is expired, please login again"]})
            }else{
                next();
            }
        }) 
    }else{
        res.status(statusCodes.RESPONSE_CODES.UNAUTHORIZED).json({status: false, messages: "Please add token in header",errors:["Please add token in header"]})
    }
}

module.exports = TokenVerify;