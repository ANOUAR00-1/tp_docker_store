import mongoose from 'mongoose';

const commandSchema = new mongoose.Schema({
 products: { type: [Number], required: true }, // [Number] تعني مصفوفة أرقام
 client_id: { type: Number, required: true },
 amount: { type: Number, required: true },
 status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Command', commandSchema);