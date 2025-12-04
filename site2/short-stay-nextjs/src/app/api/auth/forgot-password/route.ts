import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Email, generateOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    let { email } = body;

    if (!email) {
      return NextResponse.json(
        { status: 'fail', message: 'Email is required.' },
        { status: 400 }
      );
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user || user.isDeleted) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found or account is deleted.' },
        { status: 400 }
      );
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
        name: user.fullName || '',
        otp,
      }).sendPasswordReset();

      return NextResponse.json({
        status: 'success',
        message: 'OTP has been sent to your email.',
        payload: { email: user.email },
      });
    } else {
      return NextResponse.json(
        { status: 'fail', message: 'Failed to update user. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
