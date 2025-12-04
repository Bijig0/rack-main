import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { status: 'fail', message: 'Invalid token.' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(payload._id);

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'User not found.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { status: 'fail', message: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    const isMatch = await user.correctPassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        { status: 'fail', message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      status: 'success',
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
