import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

export default mongoose.models.Guest || mongoose.model('Guest', GuestSchema);
