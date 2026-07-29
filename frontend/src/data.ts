import { Document, Collection, Chat, Message } from '@/types';

export const mockDocuments: Document[] = [
  { id: '1', name: 'Machine Learning.pdf', pages: 52, chunks: 248, indexed: true, size: '8.2 MB', uploadedAt: new Date() },
  { id: '2', name: 'Deep Learning.pdf', pages: 35, chunks: 167, indexed: true, size: '5.4 MB', uploadedAt: new Date() },
  { id: '3', name: 'Operating Systems.pdf', pages: 48, chunks: 229, indexed: true, size: '7.1 MB', uploadedAt: new Date() },
  { id: '4', name: 'Database Systems.pdf', pages: 41, chunks: 196, indexed: true, size: '6.3 MB', uploadedAt: new Date() },
  { id: '5', name: 'AI Notes.pdf', pages: 23, chunks: 110, indexed: true, size: '3.8 MB', uploadedAt: new Date() },
  { id: '6', name: 'Neural Networks.pdf', pages: 67, chunks: 320, indexed: true, size: '11.2 MB', uploadedAt: new Date() },
  { id: '7', name: 'Computer Vision.pdf', pages: 44, chunks: 210, indexed: true, size: '9.6 MB', uploadedAt: new Date() },
  { id: '8', name: 'NLP Fundamentals.pdf', pages: 38, chunks: 181, indexed: true, size: '5.9 MB', uploadedAt: new Date() },
];

export const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Machine Learning Collection',
    documents: mockDocuments,
    totalPages: 322,
    totalChunks: 1250,
  },
];

export const mockChats: Chat[] = [
  { id: '1', title: 'Explain Transformer Architecture', lastMessage: 'The transformer architecture...', timestamp: new Date(Date.now() - 2 * 60000), collectionName: 'Machine Learning Collection' },
  { id: '2', title: 'Summary of ML.pdf', lastMessage: 'Machine learning is a subset...', timestamp: new Date(Date.now() - 60 * 60000), collectionName: 'Machine Learning Collection' },
  { id: '3', title: 'Compare OS Concepts', lastMessage: 'Operating systems manage...', timestamp: new Date(Date.now() - 3 * 3600000), collectionName: 'Machine Learning Collection' },
  { id: '4', title: 'What is backpropagation?', lastMessage: 'Backpropagation is an algorithm...', timestamp: new Date(Date.now() - 24 * 3600000), collectionName: 'Machine Learning Collection' },
];

export const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is the difference between supervised learning and unsupervised learning?',
    timestamp: new Date(Date.now() - 10 * 60000),
  },
  {
    id: '2',
    role: 'assistant',
    content: `Supervised learning uses labeled data to train models, where the algorithm learns from input-output pairs. Unsupervised learning, on the other hand, works with unlabeled data and aims to find hidden patterns or structures in the data.

**Key Differences:**
- Supervised learning requires labeled data.
- Unsupervised learning works with unlabeled data.
- Supervised learning is used for prediction tasks.
- Unsupervised learning is used for clustering, dimensionality reduction, etc.

This is explained in detail in Chapter 2 of Machine Learning.pdf.`,
    timestamp: new Date(Date.now() - 10 * 60000),
    sources: [
      { document: 'Machine Learning.pdf', page: 17, confidence: 98 },
      { document: 'Deep Learning.pdf', page: 45, confidence: 92 },
      { document: 'AI Notes.pdf', page: 12, confidence: 89 },
    ],
  },
];
