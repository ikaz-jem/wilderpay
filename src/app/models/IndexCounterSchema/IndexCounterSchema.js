import mongoose from 'mongoose';

const IndexCounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true, default: 0 }
});

const IndexCounter = mongoose.models.IndexCounter || mongoose.model('IndexCounter', IndexCounterSchema);
export default IndexCounter;

