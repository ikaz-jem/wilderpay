import mongoose from "mongoose"
import User from '../userSchema/UserSchema'
import Balance from "../balanceSchema/balanceSchema";

const depositSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User',require:true },
    currency: { type: String , require:true },
    depositType: { type: String },
    amount: { type: Number ,require:true},
    address: { type: String ,default:null,require:false},
    recipient: { type: String ,default:null,require:false},
    signature: { type: String ,default:null,require:false},
    chain: { type: String ,default:null,require:false},
    forwarded: { type: Boolean },
    status: {type: String,enum: ['pending', 'credited', 'canceled', 'error'],default: 'pending'},
    walletIndex: { type: Number },
    timestamp: { type: Date , required:false}
  },
  {
    timestamps: true,
  }
);


export default mongoose.models.Deposit || mongoose.model('Deposit', depositSchema);
