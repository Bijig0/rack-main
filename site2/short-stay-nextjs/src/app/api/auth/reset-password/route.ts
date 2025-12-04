import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    let { email, password, confirmPassword } = body;

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'Email, password, and confirm password are required.' },
        { status: 400 }
      );
    }

    email = email.toLowerCase();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'Password and confirm password do not match.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found.' },
        { status: 404 }
      );
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        password,
        resetPasswordOtp: null,
        resetPasswordOtpCreatedAt: null,
        resetPasswordOtpExpiresAt: null,
      }
    );

    return NextResponse.json({
      status: 'success',
      message: 'Password updated successfully.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
