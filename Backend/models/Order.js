import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    tableNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'PREPARING', 'SERVED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED'],
        default: 'PENDING'
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);