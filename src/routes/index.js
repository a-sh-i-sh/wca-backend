const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth/login");
const {
  creatingStaff,
  getStaffList,
  getStaffById,
  updateStaff,
  deleteStaffById,
} = require("../controllers/staff/staff");
const { registerValidation, loginValidation } = require("../validators/auth");
const TokenVerify = require("../middlewares/tokenVerify/TokenVerify");
const uniqueEmail = require("../middlewares/uniqueFields/uniqueEmail");
const staffValidation = require("../validators/staff");
// const VehicleManheim = require("../middlewares/Manheim/VehicleManheim");
const customerValidation = require("../validators/customer");
const {
  creatingCustomer,
  updateCustomer,
  getCustomerList,
  getCustomerById,
  deleteCustomerById,
} = require("../controllers/customers/customers");
// const Blackbook = require("../middlewares/Blackbook/Blackbook");
const { LocalMarket } = require("../controllers/localMarket/localMarket");
const {
  AddVehicles,
  getVehiclesList,
  deleteVehiclesById,
  getVehiclesById,
} = require("../controllers/vehicleList/vehicleList");
const AddVehiclesValidation = require("../validators/AddVehicles");
const uniqueVIN = require("../middlewares/uniqueFields/uniqueVIN");
const identifyID = require("../middlewares/ID_Identifier/id_identifier");
const { EncryptedData } = require("../config/encrypt_decrypt");
const updateVehicles = require("../controllers/vehicleList/updateVehicles");
const isUpdated = require("../middlewares/Marketcheck/isUpdated");
<<<<<<< HEAD
const { upload, imageValidation } = require("../controllers/vehicleList/vehicleImages");
=======
const {upload, imageValidation} = require("../controllers/vehicleList/vehicleImages");
>>>>>>> 6a2ad238282c031cbc0a7df9176aad460f603c9b
// const VehicleDetail = require("../middlewares/NHTSA/VehicleDetail");

router.post("/auth/login", loginValidation, login);
router.post(
  "/staff/create",
  TokenVerify,
  staffValidation,
  identifyID,
  uniqueEmail,
  creatingStaff,
  updateStaff
);
router.post("/staff/list", TokenVerify, identifyID, getStaffList);
router.post("/staff/edit", TokenVerify, identifyID, getStaffById);
router.post("/staff/delete", TokenVerify, identifyID, deleteStaffById);
router.post(
  "/user/create",
  TokenVerify,
  customerValidation,
  identifyID,
  uniqueEmail,
  creatingCustomer,
  updateCustomer
);
router.post("/user/list", TokenVerify, getCustomerList);
router.post("/user/edit", TokenVerify, identifyID, getCustomerById);
router.post("/user/delete", TokenVerify, identifyID, deleteCustomerById);

router.post(
  "/vehicles/add",
  TokenVerify,
  AddVehiclesValidation,
  identifyID,
  uniqueVIN,
  // isUpdated,
  AddVehicles,
  updateVehicles
);
router.post("/vehicles/list", TokenVerify, getVehiclesList);
router.post("/vehilces/edit", TokenVerify, identifyID, getVehiclesById);
router.post("/vehicles/delete", TokenVerify, identifyID, deleteVehiclesById);

router.post("/vehicles/uploadimages", TokenVerify, imageValidation)

// router.post("/manheim", VehicleManheim);
// router.post("/blackbook/usedcar", Blackbook);
// router.post("/vehicleDetailsNHTSA",VehicleDetail)
router.post("/localMarket", LocalMarket);

module.exports = router;
