const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
    {
        fullName: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String, default: null },
        role: { type: String, default: "admin" },
        otp: { type: String },
        otpExpiration: { type: Date },
    },
    { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

AdminSchema.methods.isPasswordValid = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

AdminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, email: this.email , role: "admin",},
        process.env.JWT_SECRET,
        { expiresIn: process.env["JWT_EXPIRES_IN"] }
    );
    return token;
};

AdminSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpiration = Date.now() + 60 * 1000;
    return otp;
};

AdminSchema.methods.verifyOTP = function (otp) {
    return this.otp === otp && this.otpExpiration > Date.now();
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
module.exports = Admin;
