import mongoose from 'mongoose';
import User from '../userSchema/UserSchema';

const UserHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. 'login', 'stake', 'click'
  metadata: { type: mongoose.Schema.Types.Mixed }, // anything: { path, value, etc. }
  userAgent: String,
  ip: String,

},{timestamps:true});

export default mongoose.models.UserHistory || mongoose.model("UserHistory", UserHistorySchema);
