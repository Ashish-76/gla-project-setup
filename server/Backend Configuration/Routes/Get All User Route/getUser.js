const express = require("express");

const router = express.Router();


// Controllers
const getUser = require(
    "../../Controllers/Get All User Controller/getUser"
);

const {
    updateUserStatus,
    updateUserRole,
    deleteUser
} = require(
    "../../Controllers/Admin User Controller/adminUserController"
);


// Middleware
const verifyToken = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

const authorize = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);



// GET ALL USERS
// Admin only

router.get(
    "/getData",
    verifyToken,
    authorize("admin"),
    getUser
);



// ACTIVATE / DEACTIVATE USER
// Admin only

router.patch(
    "/admin/users/:id/status",
    verifyToken,
    authorize("admin"),
    updateUserStatus
);



// CHANGE USER ROLE
// Admin only

router.patch(
    "/admin/users/:id/role",
    verifyToken,
    authorize("admin"),
    updateUserRole
);



// DELETE USER
// Admin only

router.delete(
    "/admin/users/:id",
    verifyToken,
    authorize("admin"),
    deleteUser
);


module.exports = router;