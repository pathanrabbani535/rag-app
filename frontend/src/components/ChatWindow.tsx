import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { queryRAG, clearChat } from '../services/api';
import MessageBubble from './MessageBubble';

const ChatWindow = () => {
  const [input, setInput] = useState('');
  const { messages, addMessage, setLoading, clearChat: clearStoreChat } = useStore();
  const { isLoading } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: input };
    addMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const response = await queryRAG(input, messages);
      addMessage({
        role: 'assistant' as const,
        content: response.answer,
        sources: response.sources,
      });
    } catch (e: any) {
      addMessage({
        role: 'assistant' as const,
        content: `Error: ${e.response?.data?.detail || 'Something went wrong.'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    await clearChat();
    clearStoreChat();
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full bg-transparent">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Knowledge Base</h2>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-20">
            <p className="text-gray-500 dark:text-gray-400">Upload some PDFs and start asking questions!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
