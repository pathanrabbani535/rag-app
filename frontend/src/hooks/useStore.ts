import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ document: string; text: string }>;
}

interface RAGState {
  messages: ChatMessage[];
  documents: string[];
  isDarkMode: boolean;
  isLoading: boolean;

  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setDocuments: (docs: string[]) => void;
  toggleTheme: () => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useStore = create<RAGState>()(
  persist(
    (set) => ({
      messages: [],
      documents: [],
      isDarkMode: true,
      isLoading: false,

      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      setMessages: (messages) => set({ messages }),
      setDocuments: (docs) => set({ documents: docs }),
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearChat: () => set({ messages: [] }),
    }),
    {
      name: 'rag-storage',
      partialize: (state) => ({ messages: state.messages, isDarkMode: state.isDarkMode }),
    }
  )
);
