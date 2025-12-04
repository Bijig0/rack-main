const User = require("../../models/user.mongo.js");
const Email = require("../../services/email.js");
const { generateOTP } = require("../../services/otp.js");
const sendResponse = require("../../services/response.js");

const auth = {
  register: async (req, res) => {
    try {
      const newUser = { ...req.body };
      if (newUser.password !== newUser.confirmPassword) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Password and confirm password do not match.",
          res,
        });
      }
      const existingUser = await User.findOne({ email: newUser.email });
      if (existingUser) {
        if (existingUser.isDeleted) {
          return sendResponse({
            status: "fail",
            statusCode: 400,
            message: "Your account has been deleted. Please contact Admin.",
            res,
          });
        }
        if (!existingUser.isVerified) {
          const otp = generateOTP();
          await User.updateOne(
            { _id: existingUser._id },
            {
              otp,
              otpCreatedAt: Date.now(),
              otpExpiresAt: Date.now() + 5 * 60 * 1000
            }
          );
          await new Email({
            to: existingUser?.email,
            name: existingUser?.fullName || "",
            otp,
          }).sendRegisterOtp();

          return sendResponse({
            status: "success",
            statusCode: 200,
            message: "OTP sent to your email for verification.",
            payload: { userId: existingUser?._id, name: existingUser?.fullName, email: existingUser?.email },
            res,
          });
        }

        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: `A user with this email (${newUser.email}) already exists.`,
          res,
        });
      }

      const otp = generateOTP();

      const user = await User.create({
        ...newUser,
        isVerified: false,
        otp,
        otpCreatedAt: Date.now(),
        otpExpiresAt: Date.now() + 5 * 60 * 1000
      });

      await new Email({
        to: user.email,
        name: user.fullName || "",
        otp,
      }).sendRegisterOtp();

      return sendResponse({
        status: "success",
        statusCode: 200,
        message: "Registration successful. OTP sent to email.",
        payload: { userId: user._id, name: user.fullName, email: user.email },
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
  verifyRegisterOTP: async (req, res) => {
    try {
      let { email, otp } = req.body;
      email = email.toLowerCase();
      const user = await User.findOne({ email });
      if (!user) {
        return sendResponse({
          status: "fail",
          statusCode: 404,
          message: "User not found.",
          res,
        });
      }
      if (user.isOtpExpired()) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "OTP has expired. Please request a new one.",
          res,
        });
      }
      if (!(await user.verifyOtp(otp))) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Incorrect OTP code.",
          res,
        });
      }
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          isVerified: true,
          status: "active",
          otp: null,
          otpCreatedAt: null,
          otpExpiresAt: null,
        },
        { new: true }
      );

      if (updateUser) {
        return sendResponse({
          status: "success",
          statusCode: 200,
          message: "OTP code matched. User verified successfully.",
          res,
        });
      } else {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Something went wrong while updating user.",
          res,
        });
      }

    } catch (err) {
      return sendResponse({
        status: "fail",
        statusCode: 500,
        message: err.message,
        res,
      });
    }
  },
  resendRegisterOTP: async (req, res) => {
    try {
      let { email } = req.body;
      email = email.toLowerCase();

      const user = await User.findOne({ email });

      // Check if user exists and is not deleted
      if (!user || user.isDeleted) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "User not found or has been deleted.",
          res,
        });
      }

      // prevent resend if user is already verified
      if (user.isVerified) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "This user is already verified.",
          res,
        });
      }

      const otp = generateOTP();
      const updateUser = await User.updateOne(
        { _id: user._id },
        {
          otp,
          otpCreatedAt: Date.now(),
          otpExpiresAt: Date.now() + 5 * 60 * 1000,
        }
      );

      if (updateUser) {
        await new Email({
          to: user.email,
          name: user.fullName || "",
          otp,
        }).sendPasswordReset();

        return sendResponse({
          status: "success",
          statusCode: 200,
          message: "OTP has been resent to your email address.",
          res,
        });
      } else {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Failed to update OTP. Please try again.",
          res,
        });
      }

    } catch (err) {
      return sendResponse({
        status: "fail",
        statusCode: 500,
        message: err.message,
        res,
      });
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;

      if (!email || !password) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Email and password are required.",
          res,
        });
      }

      email = email.toLowerCase();
      const user = await User.findOne({ email });

      if (!user) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "No user found with this email.",
          res,
        });
      }
      if (user.isDeleted) {
        return sendResponse({
          status: "fail",
          statusCode: 401,
          message: "Your account has been deleted by an admin. Please contact support for assistance.",
          res,
        });
      }

      if (!user.isVerified) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Please verify your email before logging in.",
          res,
        });
      }

      if (user.status !== "active") {
        return sendResponse({
          status: "fail",
          statusCode: 403,
          message: "Your account is inactive. Please contact support.",
          res,
        });
      }

      const isMatch = await user.correctPassword(password);
      if (!isMatch) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Invalid password.",
          res,
        });
      }

      // Generate JWT token
      const token = await user.createJWT();

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      return sendResponse({
        status: "success",
        statusCode: 200,
        message: "Login successful.",
        payload: { token },
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
  sendResetPasswordOTP: async (req, res) => {
    try {
      let { email } = req.body;
      if (!email) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Email is required.",
          res,
        });
      }
      email = email.toLowerCase();
      const user = await User.findOne({ email });
      if (!user || user.isDeleted) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "User not found or account is deleted.",
          res,
        });
      }

      const otp = generateOTP();

      const updateUser = await User.updateOne(
        { _id: user._id },
        {
          resetPasswordOtp: otp,
          resetPasswordOtpCreatedAt: Date.now(),
          resetPasswordOtpExpiresAt: Date.now() + 5 * 60 * 1000
        }
      );

      if (updateUser) {
        await new Email({
          to: user.email,
          name: user.fullName || "",
          otp,
        }).sendPasswordReset();

        return sendResponse({
          status: "success",
          statusCode: 200,
          message: "OTP has been sent to your email.",
          payload: { email: user.email },
          res,
        });
      } else {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Failed to update user. Please try again.",
          res,
        });
      }

    } catch (err) {
      return sendResponse({
        status: "fail",
        statusCode: 500,
        message: err.message,
        res,
      });
    }
  },
  resendResetPasswordOTP: async (req, res) => {
    try {
      let { email } = req.body;

      if (!email) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Email is required.",
          res,
        });
      }

      email = email.toLowerCase();

      const user = await User.findOne({ email });

      if (!user || user.isDeleted) {
        return sendResponse({
          status: "fail",
          statusCode: 404,
          message: "User not found or account is deleted.",
          res,
        });
      }

      const otp = generateOTP();

      const updateUser = await User.updateOne(
        { _id: user._id },
        {
          resetPasswordOtp: otp,
          resetPasswordOtpCreatedAt: Date.now(),
          resetPasswordOtpExpiresAt: Date.now() + 5 * 60 * 1000,
        }
      );

      if (updateUser) {
        await new Email({
          to: user.email,
          name: user.fullName || "",
          otp,
        }).sendPasswordReset();

        return sendResponse({
          status: "success",
          statusCode: 200,
          message: "Reset password OTP resent successfully to your email.",
          payload: { email: user.email },
          res,
        });
      } else {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Unable to resend OTP. Please try again later.",
          res,
        });
      }

    } catch (err) {
      return sendResponse({
        status: "fail",
        statusCode: 500,
        message: err.message,
        res,
      });
    }
  },
  verifyResetPasswordOTP: async (req, res) => {
    try {
      let { email, otp } = req.body;
      if (!email || !otp) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Email and OTP are required.",
          res,
        });
      }

      email = email.toLowerCase();
      const user = await User.findOne({ email });

      if (!user) {
        return sendResponse({
          status: "fail",
          statusCode: 404,
          message: "User not found.",
          res,
        });
      }
      if (
        !user.resetPasswordOtpExpiresAt ||
        Date.now() > user.resetPasswordOtpExpiresAt.getTime()
      ) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "OTP has expired. Please request a new one.",
          res,
        });
      }

      // Check if OTP matches
      const isMatch = await user.verifyResetPasswordOtp(otp);
      if (!isMatch) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Incorrect OTP code.",
          res,
        });
      }

      // Clear OTP fields after successful verification
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          resetPasswordOtp: null,
          resetPasswordOtpCreatedAt: null,
          resetPasswordOtpExpiresAt: null,
        },
        { new: true }
      );

      if (updateUser) {
        return sendResponse({
          status: "success",
          statusCode: 200,
          message: "OTP matched. You can now reset your password.",
          res,
        });
      } else {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Something went wrong while updating the user.",
          res,
        });
      }

    } catch (err) {
      return sendResponse({
        status: "fail",
        statusCode: 500,
        message: err.message,
        res,
      });
    }
  },
  resetPassword: async (req, res) => {
    try {
      let { email, password, confirmPassword } = req.body;
      if (!email || !password || !confirmPassword) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Email, password, and confirm password are required.",
          res,
        });
      }

      email = email.toLowerCase();

      if (password !== confirmPassword) {
        return sendResponse({
          status: "fail",
          statusCode: 400,
          message: "Password and confirm password do not match.",
          res,
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return sendResponse({
          status: "fail",
          statusCode: 404,
          message: "User not found.",
          res,
        });
      }

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          password,
          resetPasswordOtp: null,
          resetPasswordOtpCreatedAt: null,
          resetPasswordOtpExpiresAt: null,
        },
      );

      return sendResponse({
        status: "success",
        statusCode: 200,
        message: "Password updated successfully.",
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
  }
};

module.exports = auth;
