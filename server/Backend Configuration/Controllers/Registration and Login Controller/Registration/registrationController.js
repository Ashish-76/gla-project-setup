const User = require("../../../Models/UserSchema/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Only allow attendee/organizer during normal registration
        const allowedRoles = ["attendee", "organizer"];
        const selectedRole = role || "attendee";

        if (!allowedRoles.includes(selectedRole)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            phone: phone || "",
            role: selectedRole
        });

        await user.save();

        // Never send password/hash to client
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

module.exports = { register };