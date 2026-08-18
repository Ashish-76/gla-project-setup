const express = require("express");
const { register } = require(
    "../../../Controllers/Registration and Login Controller/Registration/registrationController"
);

const router = express.Router();

router.post("/register", register);

module.exports = router;