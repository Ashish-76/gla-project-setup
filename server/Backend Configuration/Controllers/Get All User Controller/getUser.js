const User = require("../../Models/UserSchema/user");


// GET ALL USERS
const getUser = async (req, res) => {

    try {

        const users = await User.find()
            .select("-passwordHash")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });


    } catch (error) {

        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load users"
        });

    }

};


module.exports = getUser;