const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address!"],
    },
    password: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive"
    },
    image: { type: String },
    passwordChangedAt: Date,
    passwordResetExpires: Date,
    lastLogin: Date,
    otp: String,
    otpCreatedAt: Date,
    otpExpiresAt: Date,
    resetPasswordOtp: String,
    resetPasswordOtpCreatedAt: Date,
    resetPasswordOtpExpiresAt: Date,
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Set passwordChangedAt
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 3000);
  next();
});

// Hash password on update
userSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) return next();
  this._update.password = await bcrypt.hash(this._update.password, 12);
  next();
});

// JWT creation
userSchema.methods.createJWT = async function () {
  return jwt.sign(
    { _id: this._id, roles: this.role },
    process.env.JWT_SECRET || "jwt_secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Compare password
userSchema.methods.correctPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// OTP verification
userSchema.methods.verifyOtp = async function (candidateOtp) {
  return candidateOtp === this.otp;
};

// OTP valiadtion
userSchema.methods.isOtpExpired = function () {
  return Date.now() > new Date(this.otpExpiresAt);
};


userSchema.methods.verifyResetPasswordOtp = async function (candidateOtp) {
  return candidateOtp === this.resetPasswordOtp;
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTime) {
  if (this.passwordChangedAt) {
    const changedTime = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTime < changedTime;
  }
  return false;
};

// Check if user logged in after JWT was issued
userSchema.methods.loginAfter = function (JWTTime) {
  if (this.lastLogin) {
    const loginTime = Math.floor(this.lastLogin.getTime() / 1000);
    return JWTTime < loginTime;
  }
  return false;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
