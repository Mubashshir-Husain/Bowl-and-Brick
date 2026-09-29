import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    openingHours: { type: String, required: true },
    contactNumber: { type: String },
    isAcceptingOrders: { type: Boolean, default: true } // Emergency stop button
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);