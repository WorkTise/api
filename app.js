require("dotenv").config();

const express = require("express");
const { connectDB } = require("./src/db/database");
let db;
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// GET route
app.get("/", (req, res) => {
    res.json({
        status: true,
        message: "WorkTise Testiing API is running!"
    });
});

// POST API
app.post("/api/testDB", async (req, res) => {
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
