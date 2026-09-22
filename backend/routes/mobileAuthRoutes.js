const express = require("express");

const router = express.Router();

const {
  login,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
  resendOtp,
} = require("../controller/mobileAuthController");

const {
  registerLimiter,
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimiter");

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);

module.exports = router;
