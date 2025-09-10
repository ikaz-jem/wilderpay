const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    secretKey: { type: String, required: true },  // Encrypted secret key
    publicKey: { type: String, required: true },  // Public key (wallet address)
    path: { type: String, required: true },  // BIP44 path or custom path
    type: { type: String, required: true },
    chain:{type:String}  // e.g., 'solana', 'ton'
    
},{timestamps:true});


export default mongoose.models.Wallet || mongoose.model('Wallet',WalletSchema)