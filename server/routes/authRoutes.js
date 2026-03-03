const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// /api/auth/...
router.post("/signup", authController.signupOrLogin);
router.post("/verify-otp", authController.verifyOTP);
router.get("/status", authController.checkAuthStatus);
router.post("/update-profile", authController.updateProfile);
router.post("/logout", authController.logout);

module.exports = router;
