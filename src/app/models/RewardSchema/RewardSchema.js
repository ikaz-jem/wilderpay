import mongoose from "mongoose"
import User from "../userSchema/UserSchema"
import Deposit from "../depositSchema/depositSchema"
import Withdraw from "../withdrawSchema/withdrawSchema"

const RewardSchema = new mongoose.Schema({
        user:{type:mongoose.Types.ObjectId , ref:'User'},
        level:{type:Number , default: 1},
        deposits:[{type:mongoose.Types.ObjectId ,ref:'Deposit'}],
        withdrawls:[{type:mongoose.Types.ObjectId ,ref:'Withdraw'}]




},{timestamps:true})





export default mongoose.models.Reward || mongoose.model('Reward',RewardSchema)



// RewardSchema.pre('save', function (next) {
// //   if (!this.isNew) return next(); // Only run on new users

//   if (this.walletIndex !== undefined && this.walletIndex !== null) {
//     return next();
//   }

//   const timestampIndex = Math.floor(Date.now() / 1000);
//   this.walletIndex = timestampIndex;
//   next();
// });
