import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant', 'tool', 'system'],
        required: true
    },
    content: {
        type: String
    }, // Tool call ke time content empty ho sakta hai
    toolCallId: {
        type: String
    }, // Jab 'role' tool ho
    toolCalls: {
        type: Array
    }, // Jab assistant tool request kare
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    } // 24 hours TTL
});

export default mongoose.model('Message', messageSchema);