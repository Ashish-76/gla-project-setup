const express = require("express");

const router = express.Router();

const {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    getOrganizerBookings
} = require(
    "../../Controllers/Booking Controller/bookingController"
);
const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);


// CREATE BOOKING

router.post(
    "/",
    authMiddleware,
    createBooking
);


// GET MY BOOKINGS

router.get(
    "/my",
    authMiddleware,
    getMyBookings
);


// CANCEL BOOKING

router.post(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);

// GET ALL BOOKINGS
// Admin only

router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    getAllBookings
);


module.exports = router;