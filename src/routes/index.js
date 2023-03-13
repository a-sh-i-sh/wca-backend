const express = require('express');
const router = express.Router();
const {createuser} = require("../controllers/auth/user")
const {login} = require("../controllers/auth/login")
const {getProfile,updateUser} = require("../controllers/profile/profile")


router.post('/auth/createuser',createuser);
router.post('/auth/login',login);
router.post("/profile",getProfile)
router.post("/update/profile",updateUser)

module.exports = router;