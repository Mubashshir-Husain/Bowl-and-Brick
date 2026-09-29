import { callOpenRouter } from '../services/ai/llmService.js';
import { getConversationHistory, saveMessage } from '../services/ai/conversationService.js';
import { SYSTEM_PROMPT } from '../services/ai/prompts.js';

export const chatWithAI = async (req, res) => {
    try {
        const { sessionId, tableNumber, message } = req.body;

        if (!sessionId || !tableNumber || !message) {
            return res.status(400).json({ error: "sessionId, tableNumber, and message are required" });
        }

        // 1. Purani history fetch karo
        const history = await getConversationHistory(sessionId);

        // NAYA CODE: AI ko batana ki customer kis table par hai!
        const dynamicSystemPrompt = `${SYSTEM_PROMPT}\n\nIMPORTANT CONTEXT: The customer you are talking to is currently sitting at Table Number: ${tableNumber}.`;

        // 2. LLM ke liye messages array taiyar karo
        const messages = [
            { role: 'system', content: dynamicSystemPrompt },
            ...history,
            { role: 'user', content: message }
        ];

        // console.log("========== AI KO YEH DATA JA RAHA HAI ==========");
        // console.log(JSON.stringify(messages, null, 2));
        // console.log("=================================================");

        // 3. User ki nayi baat DB mein save karo
        await saveMessage(sessionId, tableNumber, 'user', message);

        // 4. OpenRouter API ko call karo
        const aiResponse = await callOpenRouter(messages);

        // 5. AI ka jawab DB mein save karo
        if (aiResponse && aiResponse.content) {
            await saveMessage(sessionId, tableNumber, 'assistant', aiResponse.content);
        }

        res.status(200).json({
            response: aiResponse.content
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ error: "Failed to process chat request" });
    }
};