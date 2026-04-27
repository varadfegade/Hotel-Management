import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/lib/models/Booking';

export async function GET() {
  try {
    await dbConnect();
    // We need to join Booking with Room to group by roomType
    const popularRooms = await Booking.aggregate([
      {
        $lookup: {
          from: 'rooms', // Mongoose uses lowercase, plural for collection names
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $unwind: '$roomData'
      },
      {
        $group: {
          _id: '$roomData.roomType',
          bookingCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookingCount: -1 }
      }
    ]);

    return NextResponse.json(popularRooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
