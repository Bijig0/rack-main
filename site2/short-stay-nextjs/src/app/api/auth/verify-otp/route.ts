import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    let { email, otp } = body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found.' },
        { status: 404 }
      );
    }

    if (user.isOtpExpired()) {
      return NextResponse.json(
        { status: 'fail', message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (!user.verifyOtp(otp)) {
      return NextResponse.json(
        { status: 'fail', message: 'Incorrect OTP code.' },
        { status: 400 }
      );
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        isVerified: true,
        status: 'active',
        otp: null,
        otpCreatedAt: null,
        otpExpiresAt: null,
      },
      { new: true }
    );

    if (updateUser) {
      return NextResponse.json({
        status: 'success',
        message: 'OTP code matched. User verified successfully.',
      });
    } else {
      return NextResponse.json(
        { status: 'fail', message: 'Something went wrong while updating user.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
