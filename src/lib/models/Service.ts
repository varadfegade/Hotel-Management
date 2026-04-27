import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true, min: [0, 'ServiceCost must be >= 0'] }
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
