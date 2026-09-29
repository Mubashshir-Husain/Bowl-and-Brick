import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    tableNumber: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours TTL
    }
});

export default mongoose.model('Conversation', conversationSchema);