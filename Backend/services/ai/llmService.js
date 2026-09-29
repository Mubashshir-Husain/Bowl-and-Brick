import axios from 'axios';
import { aiTools } from './tools.js';
import { executeTool } from './toolExecutor.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const callOpenRouter = async (messages) => {
    try {
        // 1. FIRST CALL: Send conversation history + available tools to LLM
        const payload = {
            model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash', // Aap apni pasand ka tool-calling model daal sakte hain
            messages: messages,
            tools: aiTools,
            tool_choice: 'auto',
            max_tokens: 1000
        };
 
        const headers = {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            // OpenRouter specific optional headers 
            'HTTP-Referer': 'http://localhost:5500', 
            'X-Title': 'Restaurant AI'
        };

        const response = await axios.post(OPENROUTER_API_URL, payload, { headers });
        const responseMessage = response.data.choices[0].message;

        // 2. CHECK FOR TOOL CALLS: Did the LLM decide to use a tool?
        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
            
            // Add the assistant's tool request to the message history so LLM remembers its own action
            messages.push(responseMessage);

            // Execute all requested tools (looping through them)
            for (const toolCall of responseMessage.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments);
                
                // console.log(`[AI] Executing Tool: ${toolName} with args:`, toolArgs);
                
                // Call our secure executor
                const toolResult = await executeTool(toolName, toolArgs);

                // Add the database result to the message history
                messages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult)
                });
            }

            // 3. SECOND CALL: Send original question + tool request + database result back to LLM
            // console.log(`[AI] Sending tool results back for final answer...`);
            const finalPayload = {
                model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
                messages: messages,
                max_tokens: 1000
            };

            const finalResponse = await axios.post(OPENROUTER_API_URL, finalPayload, { headers });
            return finalResponse.data.choices[0].message;
        }

        // 4. NORMAL RESPONSE: If no tool was needed, just return the text
        return responseMessage;

    } catch (error) {
        console.error("OpenRouter API Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to communicate with AI provider");
    }
};