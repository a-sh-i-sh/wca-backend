const express = require("express");
const router = express.Router();
const { createuser } = require("../controllers/auth/user");
const { login } = require("../controllers/auth/login");
const { creatingStaff, getStaffList,getStaffById } = require("../controllers/staff/staff");
const { getProfile, updateUser } = require("../controllers/profile/profile");
const TokenVerify = require("../middlewares/TokenVerify");

router.post("/auth/createuser", createuser);
router.post("/auth/login", login);

router.post("/profile", TokenVerify, getProfile);
router.post("/update/profile", TokenVerify, updateUser);
router.post("/staff/edit", TokenVerify, getStaffById);
router.post("/staff/create", TokenVerify, creatingStaff);
router.post("/staff/list", TokenVerify, getStaffList);

module.exports = router;
