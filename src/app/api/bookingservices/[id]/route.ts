import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BookingService from '@/lib/models/BookingService';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const record = await BookingService.findByIdAndDelete(id);
    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    return NextResponse.json({ message: 'Booking service record deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
