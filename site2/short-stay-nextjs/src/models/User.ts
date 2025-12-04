import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  status: 'active' | 'inactive';
  image?: string;
  passwordChangedAt?: Date;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  otp?: string | null;
  otpCreatedAt?: Date | null;
  otpExpiresAt?: Date | null;
  resetPasswordOtp?: string | null;
  resetPasswordOtpCreatedAt?: Date | null;
  resetPasswordOtpExpiresAt?: Date | null;
  isDeleted: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  createJWT(): Promise<string>;
  correctPassword(candidatePassword: string): Promise<boolean>;
  verifyOtp(candidateOtp: string): boolean;
  isOtpExpired(): boolean;
  verifyResetPasswordOtp(candidateOtp: string): boolean;
  changedPasswordAfter(jwtTimestamp: number): boolean;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address!'],
    },
    password: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
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
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Set passwordChangedAt
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 3000);
  next();
});

// Hash password on update
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { password?: string };
  if (!update.password) return next();
  update.password = await bcrypt.hash(update.password, 12);
  next();
});

// JWT creation
userSchema.methods.createJWT = async function (): Promise<string> {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET || 'jwt_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Compare password
userSchema.methods.correctPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// OTP verification
userSchema.methods.verifyOtp = function (candidateOtp: string): boolean {
  return candidateOtp === this.otp;
};

// OTP expiration check
userSchema.methods.isOtpExpired = function (): boolean {
  return Date.now() > new Date(this.otpExpiresAt).getTime();
};

// Reset password OTP verification
userSchema.methods.verifyResetPasswordOtp = function (
  candidateOtp: string
): boolean {
  return candidateOtp === this.resetPasswordOtp;
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (
  jwtTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTime = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return jwtTimestamp < changedTime;
  }
  return false;
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
