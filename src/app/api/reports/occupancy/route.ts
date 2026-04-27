import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';

export async function GET() {
  try {
    await dbConnect();
    const occupancy = await Room.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format into an easier object map
    const formatted = occupancy.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { Available: 0, Occupied: 0, Maintenance: 0 });

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
