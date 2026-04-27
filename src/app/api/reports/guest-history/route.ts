import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET() {
  await dbConnect();
  try {
    // Populate guest and room info, sort by check-in date descending
    const history = await Booking.find()
      .populate('guestId')
      .populate('roomId')
      .sort({ checkInDate: -1 });
    
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
