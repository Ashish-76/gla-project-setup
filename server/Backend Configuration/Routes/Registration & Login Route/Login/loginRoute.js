const express = require("express");
const loginController = require(
    "../../../Controllers/Registration and Login Controller/Login/loginController"
);

const router = express.Router();

router.post("/login", loginController);

module.exports = router;