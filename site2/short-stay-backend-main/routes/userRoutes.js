const express = require("express");
const auth = require("../controllers/userController/auth.controller");
const { isAuthenticated } = require("../middlewares/auth");
const userProfile = require("../controllers/userController/profile.controller");
const fileUpload = require("../middlewares/fileUpload");
const { property } = require("../controllers/userController/propertyController");
const userRouter = express.Router();

// =======================
// Auth Routes
userRouter.post("/register", auth.register);
userRouter.post("/veify-register-otp", auth.verifyRegisterOTP);
userRouter.post("/resend-register-otp", auth.resendRegisterOTP);
userRouter.post("/login", auth.login);
userRouter.post("/reset-password-otp", auth.sendResetPasswordOTP);
userRouter.post("/resend-reset-password-otp", auth.resendResetPasswordOTP);
userRouter.post("/verify-reset-password-otp", auth.verifyResetPasswordOTP);
userRouter.post("/reset-password", auth.resetPassword);


// User Profile

userRouter.put("/profile", isAuthenticated, fileUpload("image"), userProfile.updateProfile);
userRouter.post("/profile/change-password", isAuthenticated, userProfile.changePassword);
userRouter.get("/profile", isAuthenticated, userProfile.getProfile)

// property data
userRouter.get("/pricelab-estimator", isAuthenticated, property.getPricalabEstimatorPropertyDetail)
userRouter.get("/pricelab-estimator/:id", isAuthenticated, property.getPricalabEstimatorPropertyDetailById)



// =======================

module.exports = userRouter;
