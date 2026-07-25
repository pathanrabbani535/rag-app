import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import SourceCitations from './SourceCitations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ document: string; text: string }>;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const isAssistant = message.role === 'assistant';

  useEffect(() => {
    if (isAssistant) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + message.content.charAt(index));
        index++;
        if (index >= message.content.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.content);
    }
  }, [message.content, isAssistant]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`max-w-[80%] relative group ${isAssistant ? 'bg-white dark:bg-gray-800' : 'bg-blue-600 text-white'} rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
          <ReactMarkdown>{displayedText}</ReactMarkdown>
        </div>

        {isAssistant && message.sources && (
          <SourceCitations sources={message.sources} />
        )}

        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;
