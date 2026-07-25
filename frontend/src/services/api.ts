import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const queryRAG = async (query: string, history: any[]) => {
  const response = await api.post('/query', {
    query,
    chat_history: history,
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const clearDocuments = async () => {
  const response = await api.delete('/documents/clear');
  return response.data;
};

export const clearChat = async () => {
  const response = await api.post('/chat/clear');
  return response.data;
};

export default api;
