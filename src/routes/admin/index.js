const router = require("express").Router();
const {
    createUser,
    login,
    getProfile
} = require("./admin.service");
router.post("/", createUser);
router.post("/login", login);
router.post("/profile",getProfile)
module.exports = router;
