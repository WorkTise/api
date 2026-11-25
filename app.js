
require("dotenv").config();

const express = require("express");
const { connectDB } = require("./src/config/database");
const { createUser } = require("./src/services/createUser");
const { verifyOTP } = require("./src/auth/verifyOTP");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB database instance
let db;

// Test MongoDB connection
app.post("/test", async (req, res) => {
    try {
        const result = await db.command({ ping: 1 });

        res.json({
            success: true,
            mongodb: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create user
app.post("/createUser", async (req, res) => {
    console.log(req.body)
    try {
        console.log(req.body)
        const result = await createUser(req, db);
        res.json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
});

app.post("/verifyOTP", async (req, res) => {
    console.log(req.body)
    try {
        console.log(req.body)
        const result = await verifyOTP(req, db);
        res.json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
});


// Start server
async function startServer() {
    try {
        db = await connectDB();

        app.listen(process.env.PORT || 3000, "127.0.0.1", () => {
            console.log("Express server running");
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
