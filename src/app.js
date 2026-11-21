const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const logger = require("./middleware/logger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Home endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Node.js REST API",
        version: "1.0.0"
    });
});

// API routes
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

module.exports = app;