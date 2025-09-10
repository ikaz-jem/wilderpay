const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
    percentage: { type: Number, required: true },  // Encrypted secret key
    profits:{ type: Number, required: true },
},{timestamps:true});


export default mongoose.models.Earning || mongoose.model('Earning',EarningSchema)