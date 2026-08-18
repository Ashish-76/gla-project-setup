const express = require("express");

const router = express.Router();

const {
    createEvent,
    getAllEvents,
    getEventById
} = require("../../Controllers/Event Controller/eventController");

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);


// GET ALL EVENTS
// Public route
router.get("/", getAllEvents);


// GET SINGLE EVENT
// Public route
router.get("/:id", getEventById);


// CREATE EVENT
// Organizer + Admin only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    createEvent
);


module.exports = router;