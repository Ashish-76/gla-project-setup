const Booking = require("../../Models/BookingSchema/booking");
const Event = require("../../Models/EventSchema/event");

// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const {
            eventId,
            ticketTypeId,
            quantity
        } = req.body;

        if (!eventId || !ticketTypeId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "eventId, ticketTypeId and quantity are required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const ticketType = event.ticketTypes.id(ticketTypeId);

        if (!ticketType) {
            return res.status(404).json({
                success: false,
                message: "Ticket type not found"
            });
        }

        const availableTickets = ticketType.capacity - ticketType.sold;

        if (quantity > availableTickets) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableTickets} tickets are available`
            });
        }

        const totalAmount = ticketType.price * quantity;

        const bookingReference =
            "BK-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

        const booking = await Booking.create({
            attendee: req.user._id,
            event: eventId,
            ticketTypeId: ticketTypeId,
            ticketTypeName: ticketType.name,
            quantity: quantity,
            unitPrice: ticketType.price,
            totalAmount: totalAmount,
            bookingReference: bookingReference,
            status: "confirmed"
        });

        ticketType.sold += quantity;

        await event.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET MY BOOKINGS
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            attendee: req.user._id
        })
            .populate("event")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// CANCEL BOOKING
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Check booking exists
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check ownership
        if (booking.attendee.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to cancel this booking"
            });
        }

        // Check if already cancelled
        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        // Find event
        const event = await Event.findById(booking.event);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Find ticket type
        const ticketType = event.ticketTypes.id(booking.ticketTypeId);

        if (!ticketType) {
            return res.status(404).json({
                success: false,
                message: "Ticket type not found"
            });
        }

        // Restore available tickets
        ticketType.sold -= booking.quantity;

        // Safety check
        if (ticketType.sold < 0) {
            ticketType.sold = 0;
        }

        await event.save();

        // Update booking status
        booking.status = "cancelled";

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL BOOKINGS - ADMIN
const getAllBookings = async (req, res) => {
    try {

        const bookings = await Booking.find()
            .populate("attendee", "name email phone")
            .populate("event", "title venue location date")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error("Get all bookings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load bookings"
        });
    }
};

// GET ORGANIZER BOOKINGS
const getOrganizerBookings = async (req, res) => {
    try {

        // Find events created by this organizer
        const events = await Event.find({
            organizer: req.user._id
        }).select("_id");

        const eventIds = events.map(event => event._id);

        // Find bookings for those events
        const bookings = await Booking.find({
            event: { $in: eventIds }
        })
            .populate("attendee", "name email phone")
            .populate("event", "title venue location date")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(
            "Get organizer bookings error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load organizer bookings"
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    getOrganizerBookings,
    cancelBooking
};

