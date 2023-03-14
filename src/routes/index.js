const express = require("express");
const router = express.Router();
const { createuser } = require("../controllers/auth/user");
const { login } = require("../controllers/auth/login");
const { creatingStaff, getStaffList,getStaffById,deleteStaffById } = require("../controllers/staff/staff");
const { getProfile, updateUser } = require("../controllers/profile/profile");
const TokenVerify = require("../middlewares/TokenVerify");

router.post("/auth/createuser", createuser);
router.post("/auth/login", login);

router.post("/profile", getProfile);
router.post("/update/profile", updateUser);
router.post("/staff/create", creatingStaff);
router.post("/staff/list", getStaffList);
router.post("/staff/edit", getStaffById);
router.post("/staff/delete", deleteStaffById);

module.exports = router;
