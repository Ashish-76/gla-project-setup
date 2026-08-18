require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();


// Middleware

app.use(express.json());
app.use(cors());


// Database

const connectDB = require(
    "./Backend Configuration/Configuration Folders/DB Configuration/dbConfig"
);

connectDB();

// Authentication Routes

const RegistrationApi = require(
    "./Backend Configuration/Routes/Registration & Login Route/Register/register"
);

const LoginRoute = require(
    "./Backend Configuration/Routes/Registration & Login Route/Login/loginRoute"
);

app.use("/api/auth", RegistrationApi);
app.use("/api/auth", LoginRoute);


// Protected Test Route

const protectedRoute = require(
    "./Backend Configuration/Routes/Test Route/protectedRoute"
);

app.use("/api/test", protectedRoute);

// Event Routes


const eventRoutes = require(
    "./Backend Configuration/Routes/Event Route/eventRoutes"
);

app.use("/api/events", eventRoutes);

// Health Check


app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Event Ticketing API is running"
    });
});

// Server


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});