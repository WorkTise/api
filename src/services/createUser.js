const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendOTP = require("../auth/sendOTP");

async function createUser(req, db) {

    try {
        console.log(req.body)
        const email = req.body?.email?.trim().toLowerCase();

        if (!email) {
            return { status: false, message: "Email is required" };
        }

        const users = db.collection("users");
        const auth = db.collection("Auth");

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return {
                status: false,
                message: "User already exists"
            };
        }

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp, 12);

        const now = new Date();

        await auth.updateOne(
            { email, purpose: "registration" },
            {
                $set: {
                    otpHash,
                    createdAt: now,
                    expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
                    attempts: 0,
                    purpose: "registration"
                }
            },
            { upsert: true }
        );

        const mailResult = await sendOTP(email, otp);

        if (!mailResult.status) {
            await auth.deleteOne({ email, purpose: "registration" });

            return {
                status: false,
                message: mailResult.message
            };
        }

        return {
            status: true,
            message: "OTP sent"
        };

    } catch (error) {
        console.error(error);

        return {
            status: false,
            message: "Something went wrong"
        };
    }
}

module.exports = { createUser };