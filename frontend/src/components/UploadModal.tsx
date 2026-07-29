import { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, Loader2, Trash2 } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

interface FileItem {
  file: File;
  status: 'pending' | 'uploading' | 'done';
  progress: number;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (added: FileList | null) => {
    if (!added) return;
    const newItems: FileItem[] = Array.from(added)
      .filter(f => f.type === 'application/pdf')
      .map(f => ({ file: f, status: 'pending', progress: 0 }));
    setFiles(prev => [...prev, ...newItems]);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    // Simulate upload progress
    files.forEach((_, idx) => {
      setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: 'uploading' } : f));
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: 'done', progress: 100 } : f));
        } else {
          setFiles(prev => prev.map((f, i) => i === idx ? { ...f, progress } : f));
        }
      }, 300);
    });
    onUpload(files.map(f => f.file));
    setTimeout(onClose, 2500);
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#13131f] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Upload PDFs</h2>
            <p className="text-sm text-gray-500 mt-0.5">Add documents to your collection</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
              dragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/60 hover:bg-white/5'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-white font-semibold">Drag & drop your PDFs here</p>
            <p className="text-gray-500 text-sm mt-1">or click to browse</p>
            <p className="text-gray-600 text-xs mt-3">Supports PDF files up to 50 MB each</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                  <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{f.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{fmtSize(f.file.size)}</span>
                    </div>
                  </div>
                  {f.status === 'done' ? (
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  ) : f.status === 'uploading' ? (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                  ) : (
                    <button onClick={() => removeFile(idx)} className="p-1 hover:text-red-400 text-gray-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 font-semibold text-sm transition-colors">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30"
            >
              Upload {files.length > 0 ? `(${files.length})` : ''} Document{files.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
