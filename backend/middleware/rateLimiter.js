const rateLimit = require("express-rate-limit");
const { forgotPassword } = require("../controller/mobileAuthController");

// Login rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5, // Maximum 5 attempts

  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

// Register rate limiter
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  message: {
    message:
      "Too many registration attempts. Please try again after 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 3,

  message: {
    message:
      "Too many password reset requests. Please try again after 15 minutes.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
};
