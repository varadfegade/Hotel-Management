import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Payment from '@/lib/models/Payment';

export async function GET() {
  await dbConnect();
  try {
    const revenue = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);
    
    return NextResponse.json({
      totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
