import React, { useState, useEffect } from 'react';
import { Airlock } from './components/Airlock';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);

  // Keyboard shortcut for search (Mock implementation for focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {isLocked ? (
        <Airlock onUnlock={() => setIsLocked(false)} />
      ) : (
        <Dashboard />
      )}
    </>
  );
};

export default App;
