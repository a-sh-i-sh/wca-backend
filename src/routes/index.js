const express = require("express");
const router = express.Router();
const { createuser } = require("../controllers/auth/user");
const { login } = require("../controllers/auth/login");
const {
  creatingStaff,
  getStaffList,
  getStaffById,
  updateStaff,
  deleteStaffById,
} = require("../controllers/staff/staff");
const { registerValidation, loginValidation } = require("../validators/auth");
const { getProfile, updateUser } = require("../controllers/profile/profile");
const TokenVerify = require("../middlewares/TokenVerify");
const uniqueEmail = require("../middlewares/uniqueFields/uniqueEmail");
const staffValidation = require("../validators/staff");
const VehicleManheim = require("../controllers/Manheim/VehicleManheim");
const VehicleListing = require("../controllers/NHTSA/VehicleListing");
const customerValidation = require("../validators/customer");
const {
  creatingCustomer,
  updateCustomer,
} = require("../controllers/customers/customers");

// router.post("/auth/createuser", createuser);
router.post("/auth/login", loginValidation, login);

// router.post("/profile", TokenVerify, getProfile);
// router.post("/update/profile", TokenVerify, registerValidation, updateUser);
router.post("/staff/edit", TokenVerify, getStaffById);
router.post(
  "/staff/create",
  TokenVerify,
  staffValidation,
  uniqueEmail,
  creatingStaff,
  updateStaff
);
router.post("/staff/delete", TokenVerify, deleteStaffById);
router.post("/staff/list", TokenVerify, getStaffList);
router.post(
  "/user/create",
  customerValidation,
  uniqueEmail,
  creatingCustomer,
  updateCustomer
);
router.post("/manheim", VehicleManheim);
router.post("/vehicle/list", VehicleListing);

module.exports = router;
