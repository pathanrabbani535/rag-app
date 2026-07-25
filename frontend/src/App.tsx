import React, { useEffect } from 'react';
import { useStore } from './hooks/useStore';
import ThemeToggle from './components/ThemeToggle';
import UploadZone from './components/UploadZone';
import ChatWindow from './components/ChatWindow';
import { getDocuments } from './services/api';

const App = () => {
  const { isDarkMode, setDocuments } = useStore();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs.documents);
      } catch (e) {
        console.error('Failed to fetch documents', e);
      }
    };
    fetchDocs();
  }, [setDocuments]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <h1 className="text-xl font-bold tracking-tight">RAG<span className="text-blue-600">AI</span></h1>
          </div >
          <ThemeToggle />
        </header>

        <main className="flex h-[calc(100vh-65px)] overflow-hidden">
          <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 overflow-y-auto hidden md:block">
            <div className="flex flex-col gap-6">
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-widest">Documents</h3>
                <UploadZone />
              </section>
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-widest">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 italic">Upload PDFs to start indexing your knowledge base.</p>
                </div>
              </section>
            </div >
          </aside>

          <section className="flex-1 overflow-hidden relative">
            <ChatWindow />
          </section>
        </main>
      </div >
    </div >
  );
};

export default App;
