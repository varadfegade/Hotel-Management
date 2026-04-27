import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomType: { type: String, required: true },
  price: { type: Number, required: true, min: [0.01, 'RoomPrice must be > 0'] },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  floor: { type: Number }
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
