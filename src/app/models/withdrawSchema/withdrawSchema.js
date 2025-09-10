import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId , ref:'User'},
    amount:{type:Number},
    address:{type:String},
    currency:{type:String},
    chain:{type:String}
},
{
    timestamps:true
}
)

export default mongoose.models.Withdraw || mongoose.model('Withdraw',withdrawSchema)
