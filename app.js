require("dotenv").config();

const express = require("express");
const { connectDB } = require("./src/config/database");
const { createUser } = require("./src/services/createUser");
let db;
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// POST API
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

app.post("/createUser", async (req, res) => {
    db = connectDB()
    const result = await createUser(req, db);
    res.json(result);
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
