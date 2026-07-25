import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { uploadFiles, getDocuments } from '../services/api';
import { useStore } from '../hooks/useStore';

const UploadZone = () => {
  const { setDocuments, setLoading } = useStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);
    try {
      await uploadFiles(acceptedFiles);
      const { documents } = await getDocuments();
      setDocuments(documents);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  }, [setDocuments, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
          hover:border-blue-400 dark:hover:border-blue-500`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400" />
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {uploading ? 'Uploading and indexing...' : 'Drag & drop PDFs here, or click to select'}
          </p>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default UploadZone;
