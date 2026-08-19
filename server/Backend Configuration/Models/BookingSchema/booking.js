const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        attendee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        ticketTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        ticketTypeName: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        bookingReference: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "cancelled"
            ],
            default: "confirmed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);