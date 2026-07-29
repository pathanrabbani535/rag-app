import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';

type Page = 'landing' | 'app';

export default function App() {
  const [page, setPage] = useState<Page>('landing');

  if (page === 'app') {
    return <Dashboard onGoHome={() => setPage('landing')} />;
  }

  return <LandingPage onGetStarted={() => setPage('app')} />;
}
