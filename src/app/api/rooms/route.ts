import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Room from '@/lib/models/Room';

export async function GET() {
  try {
    await dbConnect();
    const rooms = await Room.find();
    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const room = new Room(body);
    await room.save();
    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
