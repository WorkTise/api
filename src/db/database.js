
const { MongoClient } = require("mongodb");
const path = require("path");

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const authSource = process.env.MONGO_AUTH_SOURCE || "admin";

const uri = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:27017/?authSource=${encodeURIComponent(authSource)}&authMechanism=SCRAM-SHA-256`;

const client = new MongoClient(uri, {
    tls: true,

    // Verify MongoDB server certificate
    tlsCAFile: path.join(__dirname, "/src/db/certs", "mongodb-ca.pem"),

    serverSelectionTimeoutMS: 10000
});

async function connectDB() {
    try {
        await client.connect();

        // Verify connection
        await client.db("admin").command({ ping: 1 });

        console.log("MongoDB TLS connection successful!");

        return client.db("worktise");

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}

module.exports = {
    connectDB,
    client
};
