import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { Email, generateOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, email, password, confirmPassword } = body;

    if (password !== confirmPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'Password and confirm password do not match.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      if (existingUser.isDeleted) {
        return NextResponse.json(
          { status: 'fail', message: 'Your account has been deleted. Please contact Admin.' },
          { status: 400 }
        );
      }

      if (!existingUser.isVerified) {
        const otp = generateOTP();
        await User.updateOne(
          { _id: existingUser._id },
          {
            otp,
            otpCreatedAt: Date.now(),
            otpExpiresAt: Date.now() + 5 * 60 * 1000,
          }
        );

        await new Email({
          to: existingUser.email,
          name: existingUser.fullName || '',
          otp,
        }).sendRegisterOtp();

        return NextResponse.json({
          status: 'success',
          message: 'OTP sent to your email for verification.',
          payload: {
            userId: existingUser._id,
            name: existingUser.fullName,
            email: existingUser.email,
          },
        });
      }

      return NextResponse.json(
        { status: 'fail', message: `A user with this email (${email}) already exists.` },
        { status: 400 }
      );
    }

    const otp = generateOTP();

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      isVerified: false,
      otp,
      otpCreatedAt: Date.now(),
      otpExpiresAt: Date.now() + 5 * 60 * 1000,
    });

    await new Email({
      to: user.email,
      name: user.fullName || '',
      otp,
    }).sendRegisterOtp();

    return NextResponse.json({
      status: 'success',
      message: 'Registration successful. OTP sent to email.',
      payload: { userId: user._id, name: user.fullName, email: user.email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
