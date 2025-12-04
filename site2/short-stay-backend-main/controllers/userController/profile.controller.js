const User = require("../../models/user.mongo");
const sendResponse = require("../../services/response");

const userProfile = {
    updateProfile: async (req, res) => {
        try {

            const userId = req.decoded?._id;
            if (!userId) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid token. User ID missing.",
                    res,
                });
            }
            const { fullName, email } = req.body;
            const updateData = {};

            if (fullName) updateData.fullName = fullName;
            if (email) updateData.email = email;
            if (req.uploadedFiles) updateData.image = req.uploadedFiles;

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            ).select("-password -otp -otpCreatedAt -otpExpiresAt -__v");

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "Profile updated successfully.",
                payload: updatedUser,
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
            const userId = req.decoded?._id;

            if (!userId) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid token. User ID missing.",
                    res,
                });
            }

            const { oldPassword, newPassword, confirmPassword } = req.body;

            if (!oldPassword || !newPassword || !confirmPassword) {
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

            const user = await User.findById(userId);
            if (!user) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "User not found.",
                    res,
                });
            }

            const isMatch = await user.correctPassword(oldPassword);
            if (!isMatch) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Current password is incorrect.",
                    res,
                });
            }

            const isSame = await user.correctPassword(newPassword);
            if (isSame) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "New password must be different from the current password.",
                    res,
                });
            }

            user.password = newPassword;
            await user.save();

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
    getProfile: async (req, res) => {
        try {
            const userId = req.decoded?._id;

            if (!userId) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Invalid token. User ID missing.",
                    res,
                });
            }

            const user = await User.findById(userId).select("fullName email image status createdAt updatedAt");

            if (!user) {
                return sendResponse({
                    status: "fail",
                    statusCode: 404,
                    message: "User not found.",
                    res,
                });
            }

            return sendResponse({
                status: "success",
                statusCode: 200,
                message: "User profile fetched successfully.",
                payload: user,
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
}

module.exports = userProfile
