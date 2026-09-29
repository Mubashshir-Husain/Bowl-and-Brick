import Conversation from '../../models/Conversation.js';
import Message from '../../models/Message.js';

// export const getConversationHistory = async (sessionId) => {
//     const conversation = await Conversation.findOne({ sessionId });
//     if (!conversation) return [];

//     const messages = await Message.find({ conversationId: conversation._id })
//         .sort({ createdAt: 1 })
//         .select('role content -_id');
    
//     return messages;
// };

export const getConversationHistory = async (sessionId) => {
    console.log(`\n🔍 [DEBUG] Searching history for Session: '${sessionId}'`);

    // 1. Conversation dhoondho
    const conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
        // console.log(`❌ [DEBUG] Koi Conversation nahi mili is session ki.`);
        return [];
    }

    // console.log(`✅ [DEBUG] Conversation mil gayi. ID hai: ${conversation._id}`);

    // 2. Us conversation ke messages dhoondho
    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    // console.log(`✅ [DEBUG] Is conversation mein ${messages.length} messages mile.`);

    // 3. Clean JSON banakar bhejo
    return messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
};

// NAYA: tableNumber parameter add kiya
export const saveMessage = async (sessionId, tableNumber, role, content) => {
    // console.log(`\n💾 [DEBUG-SAVE] Saving message for session: '${sessionId}'`);
    
    let conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
        // console.log(`🔨 [DEBUG-SAVE] Conversation nahi mili, nayi bana rahe hain...`);
        conversation = await Conversation.create({ sessionId, tableNumber });
        // YEH LINE BATA DEGI KI KYA GADBAD HAI:
        // console.log(`✅ [DEBUG-SAVE] Nayi conversation ban gayi! ID: ${conversation._id}, DB me SessionId hai: '${conversation.sessionId}'`);
    } else {
        // console.log(`✅ [DEBUG-SAVE] Conversation mil gayi! ID: ${conversation._id}, DB me SessionId hai: '${conversation.sessionId}'`);        
    }

    const newMessage = await Message.create({
        conversationId: conversation._id,
        role,
        content
    });
    
    // console.log(`✅ [DEBUG-SAVE] Message save ho gaya! Role: ${role}`);
    return newMessage;
};