import api from './api';

export const sendChatMessage = async ({ sessionId, tableNumber, message }) => {
  try {
    const response = await api.post('/api/ai/chat', {
      sessionId,
      tableNumber,
      message,
    });
    return response.data;
  } catch (error) {
    console.error('AI chat API error:', error);
    throw error.response?.data?.error || error.response?.data?.message || 'Failed to get response from AI assistant.';
  }
};
