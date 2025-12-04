const Email = require("../../services/email")

const Admin = require("../../models/admin.mongo");
const sendResponse = require("../../services/response");
const bodyParser = require("body-parser");

const auth = {
    register: async (req, res) => {
        try {
            const { email, password, fullName } = req.body;
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Admin with this email already exists!",
                    res,
                });
            }

            const newAdmin = new Admin({ email, password, fullName });
            await newAdmin.save();
            return sendResponse({
                status: "success",
                statusCode: 201,
                message: "Admin registered successfully!",
                res,
            });
        } catch (error) {
            return sendResponse({
                status: "error",
                statusCode: 400,
                message: `Error occurred during registration: ${error.message}`,
                res,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid email or password!",
                    res,
                });
            }
            const isPasswordValid = await admin.isPasswordValid(password);
            if (!isPasswordValid) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid email or password!",
                    res,
                });
            }
            const token = admin.generateAuthToken();
            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Login successful!",
                payload: { token },
                res,
            });
        } catch (error) {
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error: ${error.message}`,
                res,
            });
        }
    }
    ,
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "Admin not found",
                    res,
                });
            }

            const otp = admin.generateOTP();
            await admin.save();

            // Send OTP via email
            const emailDetails = { to: admin.email, name: admin.fullName || "Admin", otp };
            const emailService = new Email(emailDetails);
            await emailService.send("registerOtp", "Your OTP for Password Reset");

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "OTP sent to email!",
                payload: { email: admin.email },
                res,
            });
        } catch (error) {
            console.error("Error in forgot password:", error);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: "An error occurred while processing your request.",
                payload: { error: error.message },
                res,
            });
        }
    },
    resendOTP: async (req, res) => {
        try {
            const { email } = req.body;
            const admin = await Admin.findOne({ email });

            if (!admin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "Admin not found",
                    res,
                });
            }

            const otp = admin.generateOTP();
            await admin.save();

            const emailDetails = { to: admin.email, name: admin.fullName || "Admin", otp };
            const emailService = new Email(emailDetails);
            await emailService.send("registerOtp", "Your new OTP for Password Reset");

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "New OTP sent to email!",
                payload: { email: admin.email },
                res,
            });
        } catch (error) {
            console.error("Error in resending OTP:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error: ${error.message}`,
                res,
            });
        }
    },
    verifyOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;
            const admin = await Admin.findOne({ email });

            if (!admin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "Admin not found",
                    res,
                });
            }

            const isOtpValid = admin.verifyOTP(otp);
            if (!isOtpValid) {
                const message =
                    admin.otpExpiration < Date.now()
                        ? "OTP has expired! Please request a new one."
                        : "Invalid OTP!";

                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message,
                    res,
                });
            }

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "OTP verified successfully!",
                payload: { email: admin.email },
                res,
            });
        } catch (error) {
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error: ${error.message}`,
                res,
            });
        }
    }
    ,
    resetPassword: async (req, res) => {
        try {
            const { email, password, confirmPassword } = req.body;
            const admin = await Admin.findOne({ email });

            if (!admin) {
                return sendResponse({
                    status: "error",
                    statusCode: 404,
                    message: "Admin not found",
                    res,
                });
            }

            if (password !== confirmPassword) {
                return sendResponse({
                    status: "error",
                    statusCode: 400,
                    message: "Passwords do not match!",
                    res,
                });
            }

            const isSamePassword = await admin.isPasswordValid(password);
            if (isSamePassword) {
                return sendResponse({
                    status: "error",
                    statusCode: 400,
                    message: "New password must be different from the current password.",
                    res,
                });
            }

            admin.password = password;
            admin.otp = null;
            admin.otpExpiration = null;

            await admin.save();

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Password reset successfully!",
                res,
            });
        } catch (error) {
            console.error("Error in resetting password:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error: ${error.message}`,
                res,
            });
        }
    }

};

module.exports = auth;