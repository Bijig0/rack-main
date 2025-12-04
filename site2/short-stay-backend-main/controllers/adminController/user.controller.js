const User = require("../../models/user.mongo");
const CommonAggregation = require("../../services/AggregateWithPagination");
const sendResponse = require("../../services/response");


const adminUserController = {
    createUser: async (req, res) => {
        try {
            const { fullName, email, password, confirmPassword, status = "active" } = req.body;

            if (!password || !confirmPassword || password !== confirmPassword) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "Password and confirm password do not match.",
                    res,
                });
            }

            const existing = await User.findOne({ email });
            if (existing) {
                return sendResponse({
                    status: "fail",
                    statusCode: 400,
                    message: "User already exists.",
                    res,
                });
            }

            const user = await User.create({ fullName, email, password, isVerified: true, status });

            return sendResponse({
                status: "success",
                statusCode: 201,
                message: "User created successfully.",
                payload: user,
                res,
            });
        } catch (err) {
            return sendResponse({
                status: "fail",
                statusCode: 500,
                message: err.message,
                res,
            });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const pipeline = [
                { $match: { isDeleted: false } },
                {
                    $project: {
                        fullName: 1,
                        email: 1,
                        status: 1,
                        isVerified: 1,
                        isDeleted: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            ];

            const aggregation = new CommonAggregation({
                Model: User,
                pipeline,
                query: req.query,
            });

            const { pagination, list } = await aggregation.getAggregateWithPagination();

            return sendResponse({
                status: "success",
                statusCode: 200,
                payload: { list, pagination },
                res,
            });
        } catch (err) {
            return sendResponse({
                status: "fail",
                statusCode: 500,
                message: err.message,
                res,
            });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select("fullName email status isVerified isDeleted createdAt updatedAt");;
            if (!user || user.isDeleted) {
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
                payload: user,
                res,
            });
        } catch (err) {
            return sendResponse({
                status: "fail",
                statusCode: 500,
                message: err.message,
                res,
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const updates = req.body;
            const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

            if (!updatedUser) {
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
                message: "User updated successfully.",
                payload: updatedUser,
                res,
            });
        } catch (err) {
            return sendResponse({
                status: "fail",
                statusCode: 500,
                message: err.message,
                res,
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndUpdate(
                req.params.id,
                { isDeleted: true },
                { new: true }
            );

            if (!deletedUser) {
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
                message: "User deleted successfully.",
                res,
            });
        } catch (err) {
            return sendResponse({
                status: "fail",
                statusCode: 500,
                message: err.message,
                res,
            });
        }
    },
};

module.exports = adminUserController;
