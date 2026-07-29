import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, User, ChevronDown, FileText } from 'lucide-react';
import { Message, Source } from '@/types';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onSourceClick: (doc: string, page: number) => void;
  isTyping: boolean;
}

function SourceBadge({ source, onClick }: { source: Source; onClick: () => void }) {
  const color =
    source.confidence >= 95 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
    source.confidence >= 85 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                              'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 hover:scale-105 ${color}`}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <div className="text-left min-w-0">
          <p className="font-semibold truncate max-w-[120px]">{source.document}</p>
          <p className="opacity-70">Page {source.page}</p>
        </div>
      </div>
      <div className="shrink-0 font-bold">{source.confidence}%</div>
    </button>
  );
}

function MessageBubble({ msg, onSourceClick }: { msg: Message; onSourceClick: (doc: string, page: number) => void }) {
  const isUser = msg.role === 'user';

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-white mt-3 mb-1">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-gray-300">{line.slice(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-gray-200 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'}`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-white">RAGAI</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">AI</span>
          </div>
        )}

        <div className={`px-4 py-3 rounded-2xl text-sm ${
          isUser
            ? 'bg-purple-600 text-white rounded-tr-sm'
            : 'bg-[#1a1a2e] border border-white/10 rounded-tl-sm'
        }`}>
          <div className="space-y-1">
            {renderContent(msg.content)}
          </div>
        </div>

        {msg.sources && msg.sources.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
              <ChevronDown className="w-3 h-3" /> Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {msg.sources.map((s, i) => (
                <SourceBadge key={i} source={s} onClick={() => onSourceClick(s.document, s.page)} />
              ))}
            </div>
          </div>
        )}

        <span className="text-xs text-gray-600">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function ChatArea({ messages, onSendMessage, onSourceClick, isTyping }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  const SUGGESTIONS = [
    'Summarize the key concepts',
    'What is backpropagation?',
    'Compare supervised vs unsupervised learning',
    'Explain neural network layers',
  ];

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded-2xl bg-purple-500/10 mb-4">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ask anything about your documents</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm">
              I'll search through all your uploaded PDFs and provide accurate, cited answers.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  className="text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-purple-500/30 hover:text-white transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onSourceClick={onSourceClick} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-5 pt-3 border-t border-white/10 shrink-0">
        <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl focus-within:border-purple-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your documents..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm px-4 pt-4 pb-12 resize-none focus:outline-none leading-relaxed"
            style={{ minHeight: '54px' }}
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">Press Enter to send · Shift+Enter for new line</span>
              <button
                onClick={send}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
