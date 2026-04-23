import mongoose from 'mongoose';

const commandSchema = new mongoose.Schema({
 products: [{ 
    product_id: { type: Number, required: true },
    qte: { type: Number, required: true }
 }], 
 client_id: { type: Number, required: true },
 total_price: { type: Number, default: 0 },
 status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' }
}, { timestamps: true });

export default mongoose.model('Command', commandSchema);
