const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        phone: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["attendee", "organizer", "admin"],
            default: "attendee"
        },

        profileImage: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);