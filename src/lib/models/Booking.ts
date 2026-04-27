import mongoose from 'mongoose';
import './Guest';
import './Room';

const BookingSchema = new mongoose.Schema({
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  nights: { type: Number, required: true, min: [1, 'Nights must be >= 1'] },
  discount: { type: Number, default: 0 }
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
