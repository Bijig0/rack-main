const express = require("express");
const auth = require("../controllers/adminController/auth.controller");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const profile = require("../controllers/adminController/profile.controller");
const fileUpload = require("../middlewares/fileUpload");
const adminUserController = require("../controllers/adminController/user.controller");
const adminRouter = express.Router();

// =======================
// Admin Auth Routes
adminRouter.post("/register", auth.register);
adminRouter.post("/login", auth.login);
adminRouter.post("/forgot-password", auth.forgotPassword);
adminRouter.post("/resend-otp", auth.resendOTP);
adminRouter.post("/verify-otp", auth.verifyOTP);
adminRouter.post("/reset-password", auth.resetPassword);


//Admin Profile
adminRouter.get("/profile",isAuthenticated,isAdmin,profile.getProfile)
adminRouter.put("/profile",isAuthenticated,isAdmin,fileUpload("image"), profile.editProfile);
adminRouter.post("/profile",isAuthenticated,isAdmin,profile.changePassword);


// Admin User Access
adminRouter.post("/user",isAuthenticated,isAdmin,adminUserController.createUser);
adminRouter.get("/user",isAuthenticated,isAdmin,adminUserController.getAllUsers)
adminRouter.get("/user/:id",isAuthenticated,isAdmin,adminUserController.getUserById)
adminRouter.put("/user/:id",isAuthenticated,isAdmin,adminUserController.updateUser)
adminRouter.delete("/user/:id",isAuthenticated,isAdmin,adminUserController.deleteUser)

// =======================

module.exports = adminRouter;