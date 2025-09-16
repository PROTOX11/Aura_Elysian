import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    image: { type: String, required: false },
    description: { type: String, required: false },
    referenceLink: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);

export default CustomOrder;
