import { useState } from 'react';
import { Upload, FileText, Search, Filter, MoreVertical, Clock, ChevronRight, Sparkles, LayoutGrid } from 'lucide-react';
import { Document, Chat } from '@/types';

interface SidebarProps {
  documents: Document[];
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onUploadPDF: () => void;
  storageUsedMB: number;
  storageCapacityGB: number;
  collapsed: boolean;
  onToggle: () => void;
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function Sidebar({
  documents,
  chats,
  activeChatId,
  onSelectChat,
  onUploadPDF,
  storageUsedMB,
  storageCapacityGB,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const pct = (storageUsedMB / (storageCapacityGB * 1024)) * 100;

  return (
    <aside className={`flex flex-col bg-[#0f0f1e] border-r border-white/10 transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-72 min-w-[288px]'}`}>
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-600 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-black text-lg tracking-tight">
            RAG<span className="text-purple-400">AI</span>
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* Upload button */}
      <div className="px-4 pt-4 pb-3 shrink-0">
        <button
          onClick={onUploadPDF}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30"
        >
          <Upload className="w-4 h-4" />
          Upload PDFs
        </button>
      </div>

      {/* Documents */}
      <div className="px-4 shrink-0">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Documents</p>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/8 transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:text-purple-400 text-gray-500 transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-1 min-h-0">
        {filtered.map(doc => (
          <div
            key={doc.id}
            className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate leading-tight">{doc.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">{doc.pages} pages</span>
                {doc.indexed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                )}
                <span className="text-xs text-gray-600">Indexed</span>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md transition-all">
              <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Recent Chats */}
      <div className="px-4 pt-3 border-t border-white/10 shrink-0">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recent Chats</p>
        <div className="space-y-1">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors group ${activeChatId === chat.id ? 'bg-purple-500/20 border border-purple-500/30' : 'hover:bg-white/5'}`}
            >
              <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate leading-tight">{chat.title}</p>
                <p className="text-xs text-gray-600">{timeAgo(chat.timestamp)}</p>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div className="px-4 py-3 border-t border-white/10 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Storage Used</p>
          <span className="text-xs text-gray-500">{storageUsedMB} MB / {storageCapacityGB} GB</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
