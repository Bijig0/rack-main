const express = require("express");
const router = express.Router();
const userRouter = require("../routes/userRoutes");
const adminRouter = require("./adminRoutes");

// User Routes
router.use("/user", userRouter);

//Admin Routes
router.use("/admin", adminRouter);


module.exports = router;