import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
    name:{type:String},
    description:{type:String},
    price:{type:Number},
    attributes:{type:Map,of:String},
    roi:{type:Number},
    solAddress:{type:String},
    evmAddress:{type:String},
    toneAddress:{type:String},
},{timestamps:true})



export default mongoose.moodels.Package || mongoose.model('Package',PackageSchema)
