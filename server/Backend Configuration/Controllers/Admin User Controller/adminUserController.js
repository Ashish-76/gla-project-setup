const User = require("../../Models/UserSchema/user");


// ACTIVATE / DEACTIVATE USER
const updateUserStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        // Prevent admin from deactivating himself
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: isActive
                ? "User activated successfully"
                : "User deactivated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {

        console.error("Update user status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};



// CHANGE USER ROLE
const updateUserRole = async (req, res) => {
    try {

        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = [
            "attendee",
            "organizer",
            "admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        // Prevent admin from changing his own role
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {

        console.error("Update user role error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};



// DELETE USER
const deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        // Prevent admin from deleting himself
        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};


module.exports = {
    updateUserStatus,
    updateUserRole,
    deleteUser
};