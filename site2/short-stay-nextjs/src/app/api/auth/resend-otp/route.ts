import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Email, generateOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    let { email } = body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user || user.isDeleted) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found or has been deleted.' },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { status: 'fail', message: 'This user is already verified.' },
        { status: 400 }
      );
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
        name: user.fullName || '',
        otp,
      }).sendRegisterOtp();

      return NextResponse.json({
        status: 'success',
        message: 'OTP has been resent to your email address.',
      });
    } else {
      return NextResponse.json(
        { status: 'fail', message: 'Failed to update OTP. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
