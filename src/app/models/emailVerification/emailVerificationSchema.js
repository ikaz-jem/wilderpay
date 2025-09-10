import mongoose from 'mongoose'


const emailVerificationSchema = new mongoose.Schema({

    email:{type:String},
    token:{type:String},
    timeStamps:true

})