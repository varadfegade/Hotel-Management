import mongoose from 'mongoose';
import './Booking';
import './Service';

const BookingServiceSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  quantity: { type: Number, default: 1 }
});

export default mongoose.models.BookingService || mongoose.model('BookingService', BookingServiceSchema);
