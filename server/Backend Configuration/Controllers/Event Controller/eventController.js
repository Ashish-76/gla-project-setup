const Event = require("../../Models/EventSchema/event");

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            venue,
            location,
            date,
            startTime,
            endTime,
            image,
            ticketTypes,
            status
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !venue ||
            !location ||
            !date ||
            !startTime ||
            !endTime ||
            !ticketTypes
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required event details"
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            venue,
            location,
            date,
            startTime,
            endTime,
            image,
            ticketTypes,
            status: status || "draft",
            organizer: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL EVENTS
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({
        status: "published"})
        .populate("organizer", "name email")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET MY EVENTS
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({
            organizer: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET EVENT BY ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "name email");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE EVENT
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Organizer can update only their own event
        // Admin can update any event
        if (
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this event"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "venue",
            "location",
            "date",
            "startTime",
            "endTime",
            "image",
            "ticketTypes",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        await event.save();

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE EVENT
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Organizer can delete only their own event
        // Admin can delete any event
        if (
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this event"
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent
};