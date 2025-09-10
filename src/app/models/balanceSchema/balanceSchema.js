import mongoose from "mongoose";


const BalanceSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId},
    currency:{type:String , lowercase:true , trim:true},
    amount:{type:Number , default:0},
},{timestamps:true})


export default mongoose.models.Balance ||mongoose.model('Balance',BalanceSchema)