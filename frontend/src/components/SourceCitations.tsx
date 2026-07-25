import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface Source {
  document: string;
  text: string;
}

interface SourceCitationsProps {
  sources: Source[];
}

const SourceCitations = ({ sources }: SourceCitationsProps) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Sources:
      </p>
      <div className="flex flex-col gap-2">
        {sources.map((source, idx) => (
          <div
            key={idx}
            className="text-xs p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            <div className="flex items-center gap-1 font-medium mb-1">
              <FileText className="w-3 h-3" />
              <span>{source.document}</span>
            </div>
            <p className="italic opacity-80 line-clamp-3">"{source.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceCitations;
