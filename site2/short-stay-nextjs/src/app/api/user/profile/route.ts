import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  await connectDB();
  const user = await User.findById(payload._id).select('-password');
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: 'success',
      payload: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          image: user.image,
          status: user.status,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { status: 'fail', message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, image } = body;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { fullName, image },
      { new: true }
    ).select('-password');

    return NextResponse.json({
      status: 'success',
      message: 'Profile updated successfully.',
      payload: {
        user: {
          _id: updatedUser?._id,
          fullName: updatedUser?.fullName,
          email: updatedUser?.email,
          image: updatedUser?.image,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { status: 'fail', message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
