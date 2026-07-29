import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, FileText } from 'lucide-react';

interface PDFViewerProps {
  documentName: string;
  currentPage: number;
  totalPages: number;
  onClose: () => void;
}

export default function PDFViewer({ documentName, currentPage, totalPages, onClose }: PDFViewerProps) {
  const [page, setPage] = useState(currentPage);
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col bg-[#0f0f1e] border-l border-white/10 w-80 min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-orange-500/20 rounded-lg shrink-0">
            <FileText className="w-4 h-4 text-orange-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{documentName}</p>
            <p className="text-xs text-gray-500">Page {page}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-400">
          <span className="text-white font-medium">{page}</span> / {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <div
          className="bg-white rounded-lg overflow-hidden shadow-xl"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}
        >
          {/* Simulated PDF page content */}
          <div className="p-5 text-gray-800 min-h-[400px] text-xs leading-relaxed">
            <h2 className="text-base font-bold mb-3 text-gray-900">2. Supervised Learning</h2>
            <p className="mb-3 text-gray-700">
              Supervised learning is the machine learning task of learning a function that maps an input to an output based on example input-output pairs. It infers a function from labeled training data consisting of a set of training examples.
            </p>
            <p className="mb-3 text-gray-700">
              In supervised learning, each example is a pair consisting of an input object (typically a vector) and a desired output value (also called the supervisory signal).
            </p>
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-2.5 rounded my-3">
              <p className="text-gray-700 font-medium text-xs">
                In supervised learning, each example is a <span className="bg-yellow-300 px-0.5">pair consisting of an input object (typically a vector)</span> and a desired output value (also called the supervisory signal).
              </p>
            </div>
            <p className="mb-3 text-gray-700">
              A supervised learning algorithm analyzes the training data and produces an inferred function, which can be used for mapping new examples.
            </p>
            <p className="mb-3 text-gray-700">
              The optimal scenario will allow for the algorithm to correctly determine the class labels for unseen instances. This requires the learning algorithm to generalize from the training data to unseen situations.
            </p>
            <h3 className="font-bold mt-4 mb-2 text-gray-900">2.1 Types of Supervised Learning</h3>
            <p className="mb-2 text-gray-700">
              There are two main types of supervised machine learning problems:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-gray-700">
              <li><strong>Classification:</strong> Predicting a discrete class label output</li>
              <li><strong>Regression:</strong> Predicting a continuous quantity output</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.max(50, z - 10))}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-gray-400 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(150, z + 10))}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
          Open Full Document
        </button>
      </div>
    </div>
  );
}
