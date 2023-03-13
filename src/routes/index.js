const express = require('express');
const router = express.Router();
const {createuser} = require("../controllers/auth/user")
const {login} = require("../controllers/auth/login");
const { creatingStaff, getStaffList } = require('../controllers/staff/staff');


router.post('/auth/createuser',createuser);
router.post('/auth/login',login);

router.post('/staff/create',creatingStaff)
router.post('/staff/list',getStaffList)
module.exports = router;