import mongoose from "mongoose";

const BonusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId },
    currency: { type: String, lowercase: true, trim: true },
    name: String,
    level: Number,
    amount: Number,
    claimed:Boolean
  },
  { timestamps: true }
);

export default mongoose.models.Bonus || mongoose.model("Bonus", BonusSchema);
