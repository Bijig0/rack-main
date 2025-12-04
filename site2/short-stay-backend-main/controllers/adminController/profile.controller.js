const Admin = require("../../models/admin.mongo");
const sendResponse = require("../../services/response");

const profile = {
    getProfile: async (req, res) => {
        try {
            const adminId = req.decoded?._id;

            if (!adminId) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid token. Admin ID missing.",
                    res,
                });
            }
            const admin = await Admin.findById(adminId).select("-password -otp -otpExpiration -__v");
            if (!admin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "Admin not found.",
                    res,
                });
            }
            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Admin profile fetched successfully.",
                payload: admin,
                res,
            });
        } catch (error) {
            console.error("Error in getProfile:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error fetching profile: ${error.message}`,
                res,
            });
        }
    },
    editProfile: async (req, res) => {
        try {
            const adminId = req.decoded?._id;

            if (!adminId) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid token. Admin ID missing.",
                    res,
                });
            }

            const { fullName, email } = req.body;
            const updateData = {};

            if (fullName) updateData.fullName = fullName;
            if (email) updateData.email = email;
            if (req.uploadedFiles) updateData.image = req.uploadedFiles;

            const updatedAdmin = await Admin.findByIdAndUpdate(
                adminId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select("-password -otp -otpExpiration -__v");

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Profile updated successfully.",
                payload: updatedAdmin,
                res,
            });
        } catch (error) {
            console.error("Error in editProfile:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error updating profile: ${error.message}`,
                res,
            });
        }
    },
    changePassword: async (req, res) => {
        try {
            const adminId = req.decoded?._id; 
            if (!adminId) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid token. Admin ID missing.",
                    res,
                });
            }

            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "All password fields are required.",
                    res,
                });
            }

            if (newPassword !== confirmPassword) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "New password and confirm password do not match.",
                    res,
                });
            }

            const admin = await Admin.findById(adminId);

            if (!admin) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "Admin not found.",
                    res,
                });
            }

            const isMatch = await admin.isPasswordValid(currentPassword);

            if (!isMatch) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Current password is incorrect.",
                    res,
                });
            }

            const isSame = await admin.isPasswordValid(newPassword);
            if (isSame) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "New password must be different from the current password.",
                    res,
                });
            }

            admin.password = newPassword;
            await admin.save();

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Password changed successfully.",
                res,
            });
        } catch (error) {
            console.error("Error in changePassword:", error.message);
            return sendResponse({
                status: "error",
                statusCode: 500,
                message: `Error changing password: ${error.message}`,
                res,
            });
        }
    },
}

module.exports = profile