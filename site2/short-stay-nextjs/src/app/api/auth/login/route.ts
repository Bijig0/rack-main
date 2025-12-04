import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: 'fail', message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'No user found with this email.' },
        { status: 400 }
      );
    }

    if (user.isDeleted) {
      return NextResponse.json(
        { status: 'fail', message: 'Your account has been deleted by an admin. Please contact support for assistance.' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { status: 'fail', message: 'Please verify your email before logging in.' },
        { status: 400 }
      );
    }

    if (user.status !== 'active') {
      return NextResponse.json(
        { status: 'fail', message: 'Your account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    const isMatch = await user.correctPassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { status: 'fail', message: 'Invalid password.' },
        { status: 400 }
      );
    }

    // Generate JWT token using jose
    const token = await signToken({ _id: user._id.toString() });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const response = NextResponse.json({
      status: 'success',
      message: 'Login successful.',
      payload: { token },
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
