import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BookingService from '@/lib/models/BookingService';

export async function GET() {
  await dbConnect();
  try {
    const records = await BookingService.find().populate('bookingId').populate('serviceId');
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const record = new BookingService(body);
    await record.save();
    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
