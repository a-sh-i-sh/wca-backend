const express = require('express');
const router = express.Router();
const {createuser} = require("../controllers/auth/user")
const {login} = require("../controllers/auth/login")


router.post('/auth/createuser',createuser);
router.post('/auth/login',login);

module.exports = router;