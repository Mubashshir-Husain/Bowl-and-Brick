import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sendChatMessage } from '../../services/aiService';
import { Sparkles, X, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';

const SUGGESTIONS = [
  'Recommend popular starters 🍲',
  'Show vegetarian dishes 🥗',
  'What drinks do you recommend? 🍹',
  'Is Paneer Tikka spicy? 🌶️',
];

const AIChatbotWidget = () => {
  const { sessionId, tableNumber } = useSelector((state) => state.customer);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 Welcome to Bowl & Brick! I am your AI food concierge for Table ${tableNumber || 'your table'}. How can I assist you with recommendations or order questions today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    if (!tableNumber) {
      setChatError('Please set your table number before chatting with the AI assistant.');
      return;
    }

    setChatError(null);
    const userMsgId = Date.now().toString();
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgList = [
      ...messages,
      { id: userMsgId, role: 'user', content: text, time: userTime },
    ];

    setMessages(newMsgList);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await sendChatMessage({
        sessionId,
        tableNumber: tableNumber.toString(),
        message: text,
      });

      const aiContent = data.response || 'I am happy to assist with your order!';
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: aiContent, time: aiTime },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatError(typeof err === 'string' ? err : 'Unable to reach AI assistant right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 right-4 z-40 bg-[#100C09] text-[#F7F4ED] p-3 rounded-full shadow-xl flex items-center gap-1.5 border border-[#C8A96B]/30 transition-all transform hover:scale-105 active:scale-95 group font-bold"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Sparkles size={18} className="animate-pulse text-[#C8A96B]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#8FA28A] border border-[#100C09]"></span>
          </div>

          <span className="text-[11px] font-black pr-1 hidden sm:inline group-hover:inline">
            Ask AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 sm:bottom-16 right-0 sm:right-4 z-50 w-full sm:w-96 max-h-[85vh] sm:max-h-[550px] h-[80vh] sm:h-[500px] bg-[#F7F4ED] rounded-t-2xl sm:rounded-2xl border border-[#C8A96B]/25 shadow-2xl flex flex-col overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="p-3.5 bg-[#100C09] text-[#F7F4ED] flex items-center justify-between shrink-0 border-b border-[#C8A96B]/20 shadow-lg">

            <div className="flex items-center gap-2.5">

              <div className="w-8 h-8 rounded-lg bg-[#C8A96B] text-[#100C09] flex items-center justify-center font-bold shadow-sm">
                <Bot size={18} />
              </div>

              <div>
                <h3 className="font-extrabold text-xs leading-tight flex items-center gap-1 text-[#F7F4ED]">
                  <span>Bowl & Brick AI</span>
                  <Sparkles size={12} className="text-[#C8A96B]" />
                </h3>

                <p className="text-[10px] text-[#EEEEEE]/55 font-semibold flex items-center gap-1">
                  <span>Table {tableNumber || 'Not Set'}</span>
                  <span>•</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA28A] animate-pulse"></span>
                  <span>Online</span>
                </p>
              </div>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-[#15110E] hover:bg-[#C8A96B]/15 text-[#EEEEEE] hover:text-[#C8A96B] transition border border-[#C8A96B]/10"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>

          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F7F4ED]">

            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isAssistant
                        ? 'bg-[#100C09] text-[#C8A96B]'
                        : 'bg-[#C8A96B] text-[#100C09]'
                    }`}
                  >
                    {isAssistant ? <Bot size={13} /> : <User size={13} />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-xl p-2.5 text-xs leading-relaxed shadow-sm ${
                      isAssistant
                        ? 'bg-white text-[#100C09] border border-[#C8A96B]/15 rounded-tl-xs font-semibold'
                        : 'bg-[#100C09] text-[#F7F4ED] rounded-tr-xs font-bold'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-[11px]">
                      {msg.content}
                    </p>

                    <span
                      className={`block text-[8px] mt-1 text-right font-semibold ${
                        isAssistant ? 'text-[#100C09]/40' : 'text-[#EEEEEE]/50'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#100C09]/50">

                <div className="w-6 h-6 rounded-lg bg-[#100C09] text-[#C8A96B] flex items-center justify-center shrink-0">
                  <Bot size={13} />
                </div>

                <div className="bg-white border border-[#C8A96B]/15 p-2.5 rounded-xl rounded-tl-xs flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B] animate-bounce [animation-delay:0.4s]"></span>
                </div>

              </div>
            )}

            {/* Chat Error alert */}
            {chatError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold rounded-xl flex items-center gap-1.5">
                <AlertCircle size={14} className="shrink-0 text-red-500" />
                <span className="flex-1">{chatError}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-1.5 bg-[#EEEEEE] border-t border-[#C8A96B]/15 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">

            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                disabled={loading}
                className="whitespace-nowrap text-[10px] font-bold bg-[#F7F4ED] text-[#100C09] px-2.5 py-1 rounded-full border border-[#C8A96B]/20 hover:bg-[#C8A96B]/15 hover:border-[#C8A96B]/40 transition disabled:opacity-50"
              >
                {sug}
              </button>
            ))}

          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-[#F7F4ED] border-t border-[#C8A96B]/20 flex items-center gap-1.5 shrink-0"
          >

            <input
              type="text"
              placeholder="Ask for recommendations..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 px-3 py-1.5 bg-white border border-[#C8A96B]/20 rounded-lg text-xs font-semibold text-[#100C09] placeholder-[#100C09]/35 focus:outline-none focus:border-[#C8A96B] disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="w-8 h-8 rounded-lg bg-[#C8A96B] hover:bg-[#D8BB7C] text-[#100C09] flex items-center justify-center transition shadow-sm disabled:opacity-40"
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>

          </form>

        </div>
      )}
    </>
  );
};

export default AIChatbotWidget;