import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET() {
  await dbConnect();
  try {
    const today = new Date();
    // We want bookings where checkOutDate is in the future (meaning they are still staying or haven't checked in, but let's just get any pending checkouts)
    const pendingCheckouts = await Booking.find({
      checkOutDate: { $gte: today }
    })
    .populate('guestId')
    .populate('roomId')
    .sort({ checkOutDate: 1 });

    return NextResponse.json(pendingCheckouts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
