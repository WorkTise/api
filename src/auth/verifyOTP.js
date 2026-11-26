const bcrypt = require("bcrypt");
const { SECURITY } = require("../config/vars")

async function verifyOTP(req, db) {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const otp = String(req.body.otp || "");
        const now = new Date();
        if (!email) {
            return {
                status: false,
                message: "Invalid Email Entered"
            };
        }
        if (!/^\d{6}$/.test(otp)) {
            return {
                status: false,
                message: "Invalid OTP Entered"
            };
        }


        const auth = db.collection("Auth");
        const verifiedwithOTP = db.collection("verifiedwithOTP");

        const record = await auth.findOne({
            email,
            purpose: "registration"
        });

        if (!record) {
            return {
                status: false,
                message: "OTP Invalid or Expired"
            };
        }

        if (record.expiresAt <= new Date()) {
            await auth.deleteOne({ _id: record._id });

            return {
                status: false,
                message: "OTP expired"
            };
        }

        if (record.attempts >= SECURITY.OTP_MAX_ATTEMPTS) {
            return {
                status: false,
                message: "Too many attempts"
            };
        }

        const valid = await bcrypt.compare(otp, record.otpHash);

        if (!valid) {
            await auth.updateOne(
                { _id: record._id, attempts: record.attempts },
                { $inc: { attempts: 1 } }
            );

            return {
                status: false,
                message: "Invalid OTP"
            };
        }

        // Consume OTP only if it is still valid and unused.
        const consumed = await auth.deleteOne({
            _id: record._id,
            otpHash: record.otpHash,
            expiresAt: { $gt: new Date() },
            attempts: { $lt: 5 }
        });

        if (consumed.deletedCount !== 1) {
            return {
                status: false,
                message: "OTP already used or expired"
            };
        }

        await verifiedwithOTP.insertOne({
            email,
            verifiedAt: new Date(),
            expiresAt: new Date(now.getTime() + SECURITY.VERIFIED_TILL_HRS)
        });

        return {
            status: true,
            message: "User registered successfully"
        };

    } catch (error) {
        console.error(error);

        return {
            status: false,
            message: "Something went wrong"
        };
    }
}

module.exports = { verifyOTP };