const transporter = require("../config/mail");

async function sendOTP(email, otp) {
    try {
        await transporter.sendMail({
            from: '"Worktise" <noreply@worktise.com>',
            to: email,
            subject: "Your Worktise verification code",
            text: `Your OTP is ${otp}. It expires in 10 minutes.`,
            html: `
                <h2>Worktise verification</h2>
                <p>Your verification code is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            `
        });

        return { status: true, message: "Email Dent" };

    } catch (error) {
        console.error("Email error:", error);
        return { status: false, message: error };
    }
}

module.exports = sendOTP;