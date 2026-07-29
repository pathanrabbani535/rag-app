export interface Document {
  id: string;
  name: string;
  pages: number;
  chunks: number;
  indexed: boolean;
  size: string;
  uploadedAt: Date;
}

export interface Source {
  document: string;
  page: number;
  confidence: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  collectionName: string;
}

export interface Collection {
  id: string;
  name: string;
  documents: Document[];
  totalPages: number;
  totalChunks: number;
}
