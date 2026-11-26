const TIME = Object.freeze({
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
    YEAR: 365 * 24 * 60 * 60 * 1000
});

const SECURITY = Object.freeze({
    OTP_EXPIRE_MIN: 10 * TIME.MINUTE,
    OTP_MAX_ATTEMPTS: 5,
    VERIFIED_TILL_HRS: 2 * TIME.HOUR
});

module.exports = { TIME, SECURITY };