import { useState } from 'react';
import { ChevronRight, ChevronDown, LayoutGrid, User } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import PDFViewer from '@/components/PDFViewer';
import UploadModal from '@/components/UploadModal';
import { mockDocuments, mockCollections, mockChats, SAMPLE_MESSAGES } from '@/data';
import { Message, Document } from '@/types';

interface DashboardProps {
  onGoHome: () => void;
}

const AI_RESPONSES: Record<string, { content: string; sources: { document: string; page: number; confidence: number }[] }> = {
  default: {
    content: `Based on the documents in your collection, here is what I found:

The topic you asked about is covered extensively across multiple documents. The key concepts involve understanding both theoretical foundations and practical applications.

**Key Findings:**
- The primary explanation can be found in Machine Learning.pdf
- Additional context is provided in Deep Learning.pdf
- Supplementary notes in AI Notes.pdf offer further clarification

This information has been retrieved with high confidence from your indexed documents.`,
    sources: [
      { document: 'Machine Learning.pdf', page: 23, confidence: 96 },
      { document: 'Deep Learning.pdf', page: 11, confidence: 88 },
      { document: 'AI Notes.pdf', page: 7, confidence: 82 },
    ],
  },
  supervised: {
    content: `Supervised learning uses labeled data to train models, where the algorithm learns from input-output pairs. Unsupervised learning, on the other hand, works with unlabeled data and aims to find hidden patterns or structures in the data.

**Key Differences:**
- Supervised learning requires labeled data.
- Unsupervised learning works with unlabeled data.
- Supervised learning is used for prediction tasks.
- Unsupervised learning is used for clustering, dimensionality reduction, etc.

This is explained in detail in Chapter 2 of Machine Learning.pdf.`,
    sources: [
      { document: 'Machine Learning.pdf', page: 17, confidence: 98 },
      { document: 'Deep Learning.pdf', page: 45, confidence: 92 },
      { document: 'AI Notes.pdf', page: 12, confidence: 89 },
    ],
  },
  transformer: {
    content: `The Transformer architecture, introduced in the paper "Attention Is All You Need" (2017), revolutionized natural language processing by replacing recurrent networks entirely with attention mechanisms.

**Core Components:**
- Multi-head self-attention layers
- Positional encodings to preserve sequence order
- Feed-forward networks after attention
- Layer normalization and residual connections

The encoder processes the input sequence and the decoder generates the output, both using stacked identical layers. This is covered in Chapter 8 of Deep Learning.pdf.`,
    sources: [
      { document: 'Deep Learning.pdf', page: 82, confidence: 97 },
      { document: 'Machine Learning.pdf', page: 54, confidence: 85 },
    ],
  },
  backprop: {
    content: `Backpropagation is the algorithm used to train neural networks by computing gradients of the loss function with respect to the weights using the chain rule of calculus.

**Steps:**
- Forward pass: compute predictions and loss
- Backward pass: compute gradients layer by layer
- Weight update: adjust weights using gradient descent

The algorithm propagates the error signal backwards through the network, enabling each layer to learn its contribution to the overall error.`,
    sources: [
      { document: 'Neural Networks.pdf', page: 31, confidence: 99 },
      { document: 'Deep Learning.pdf', page: 24, confidence: 94 },
    ],
  },
};

function pickResponse(q: string) {
  const lower = q.toLowerCase();
  if (lower.includes('supervised') || lower.includes('unsupervised')) return AI_RESPONSES.supervised;
  if (lower.includes('transformer') || lower.includes('attention')) return AI_RESPONSES.transformer;
  if (lower.includes('backprop') || lower.includes('gradient')) return AI_RESPONSES.backprop;
  return AI_RESPONSES.default;
}

export default function Dashboard({ onGoHome }: DashboardProps) {
  const collection = mockCollections[0];
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState('');
  const [pdfViewer, setPdfViewer] = useState<{ name: string; page: number; totalPages: number } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  const storageUsedMB = 43;

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const resp = pickResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: resp.content,
        timestamp: new Date(),
        sources: resp.sources,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSourceClick = (docName: string, page: number) => {
    const doc = documents.find(d => d.name === docName);
    setPdfViewer({ name: docName, page, totalPages: doc?.pages ?? 50 });
  };

  const handleUpload = (files: File[]) => {
    const newDocs: Document[] = files.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      pages: Math.floor(Math.random() * 60) + 10,
      chunks: Math.floor(Math.random() * 300) + 50,
      indexed: true,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date(),
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const totalPages = documents.reduce((a, d) => a + d.pages, 0);
  const totalChunks = documents.reduce((a, d) => a + d.chunks, 0);

  return (
    <div className="flex h-screen bg-[#0d0d1a] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        documents={documents}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={id => { setActiveChatId(id); setMessages([]); }}
        onUploadPDF={() => setShowUpload(true)}
        storageUsedMB={storageUsedMB}
        storageCapacityGB={5}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-5 border-b border-white/10 bg-[#0d0d1a] shrink-0">
          <div className="flex items-center gap-2">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors mr-1"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            )}
            <span
              className="text-sm text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
              onClick={onGoHome}
            >
              Workspace
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className="relative">
              <button
                onClick={() => setShowCollectionMenu(p => !p)}
                className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-purple-300 transition-colors"
              >
                {collection.name}
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showCollectionMenu && (
                <div className="absolute top-8 left-0 bg-[#1a1a2e] border border-white/10 rounded-xl p-1.5 shadow-xl z-20 min-w-[220px]">
                  {mockCollections.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setShowCollectionMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            {[
              [`${documents.length} Documents`],
              [`${totalPages} Pages`],
              [`${totalChunks.toLocaleString()} Chunks`],
            ].map(([label]) => (
              <span key={label} className="text-sm font-medium text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1a1a2e] border border-white/10 px-3 py-1 rounded-full">
              GPT-4o
              <span className="flex items-center gap-1 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Ready
              </span>
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Chat */}
          <ChatArea
            messages={messages}
            onSendMessage={handleSendMessage}
            onSourceClick={handleSourceClick}
            isTyping={isTyping}
          />

          {/* PDF Viewer */}
          {pdfViewer && (
            <PDFViewer
              documentName={pdfViewer.name}
              currentPage={pdfViewer.page}
              totalPages={pdfViewer.totalPages}
              onClose={() => setPdfViewer(null)}
            />
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
