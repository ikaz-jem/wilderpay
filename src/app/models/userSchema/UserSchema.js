import mongoose, { mongo } from "mongoose";
import Withdraw from "../withdrawSchema/withdrawSchema";
import Deposit from "../depositSchema/depositSchema";
import Balance from "../balanceSchema/balanceSchema";
import Staking from "../stacking/stakingSchema";
import Bonus from "../BonusSchema/BonusSchema";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([-]?.\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: { type: String },
    password: { type: String, trim: true },
    balance: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 },
    image: { type: String, defaul: null },
    invested: { type: Number, default: 0 },
    staking: [{ type: mongoose.Types.ObjectId, ref: "Staking" }],
    balances: [{ type: mongoose.Types.ObjectId, ref: "Balance" }],
    deposits: [{ type: mongoose.Types.ObjectId, ref: "Deposit" }],
    withdrawls: [{ type: mongoose.Types.ObjectId, ref: "Withdraw" }],
    bonuses: [{ type: mongoose.Types.ObjectId, ref: "Bonus" }],
    nextBonus: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    role: { type: String, default: "user" , required:false },
    verificationToken: String,
    verificationTokenExpires: Date,
    emailVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    isRestricted: { type: Boolean, default: false },
    accountType: { type: mongoose.Types.ObjectId, ref: "Package" },
    walletIndex: { type: Number, default: undefined },
    referredBy: { type: mongoose.Types.ObjectId, ref: "User", default: null },
    referredUsers: {
      type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  if (!this.isNew) return next(); // Only run on new users

  if (this.walletIndex !== undefined && this.walletIndex !== null) {
    return next();
  }

  const timestampIndex = Math.floor(Date.now() / 1000);
  this.walletIndex = timestampIndex;
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
