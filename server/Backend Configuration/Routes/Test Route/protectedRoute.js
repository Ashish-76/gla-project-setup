const express = require("express");

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);

const router = express.Router();


// Any authenticated user
router.get(
    "/protected",
    authMiddleware,
    (req, res) => {
        res.json({
            success: true,
            message: "You accessed a protected route",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);


// Organizer OR Admin
router.get(
    "/organizer",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Organizer/Admin access granted",
            role: req.user.role
        });
    }
);


// Admin only
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin access granted",
            role: req.user.role
        });
    }
);

module.exports = router;