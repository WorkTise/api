const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 25,
    secure: false,
    // Enable SMTP connection logging
    logger: true,

    // Log SMTP transactions without logging email content
    transactionLog: true,
    debug: false
});

module.exports = transporter;