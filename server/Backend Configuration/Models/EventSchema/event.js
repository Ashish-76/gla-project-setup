const mongoose = require("mongoose");

const ticketTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        sold: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        _id: true
    }
);

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 150
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        venue: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        ticketTypes: {
            type: [ticketTypeSchema],
            required: true,
            validate: {
                validator: function (tickets) {
                    return tickets.length > 0;
                },
                message: "At least one ticket type is required"
            }
        },

        status: {
            type: String,
            enum: ["draft", "published", "cancelled", "completed"],
            default: "draft"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);