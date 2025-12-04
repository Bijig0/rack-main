import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    let { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { status: 'fail', message: 'Email and OTP are required.' },
        { status: 400 }
      );
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found.' },
        { status: 404 }
      );
    }

    if (
      !user.resetPasswordOtpExpiresAt ||
      Date.now() > user.resetPasswordOtpExpiresAt.getTime()
    ) {
      return NextResponse.json(
        { status: 'fail', message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const isMatch = user.verifyResetPasswordOtp(otp);
    if (!isMatch) {
      return NextResponse.json(
        { status: 'fail', message: 'Incorrect OTP code.' },
        { status: 400 }
      );
    }

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
      return NextResponse.json({
        status: 'success',
        message: 'OTP matched. You can now reset your password.',
      });
    } else {
      return NextResponse.json(
        { status: 'fail', message: 'Something went wrong while updating the user.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
